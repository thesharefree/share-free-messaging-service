import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Bind } from '@nestjs/common';
import { Message } from '../entities/message.entity';
import { Server, Socket } from 'socket.io';
import { Conference } from 'src/types/conference.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log('Init', server);
  }

  handleConnection(socket: Socket) {
    const query = socket.handshake.query;
    console.log('Connect', query);
    this.chatService.userConnected(query.userName.toString(), query.registrationToken.toString());
  }

  handleDisconnect(socket: Socket) {
    const query = socket.handshake.query;
    console.log('Disconnect', socket.handshake.query);
    this.chatService.userDisconnected(query.userName.toString());
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('chat')
  async handleNewMessage(
    @MessageBody() message: Message,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('New message', message);
    const query = client.handshake.query;
    message.senderEmail = query.userName.toString();
    await this.chatService.saveMessage(message);
    client.emit(`${message.recipientType}-${message.recipientId}`, message);
    client.broadcast.emit(
      `${message.recipientType}-${message.recipientId}`,
      message,
    );
    await this.chatService.sendMessageToOfflineUsers(message);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('start_call')
  async handleStartCall(
    @MessageBody() data: Conference,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('start call data', data);
    const query = client.handshake.query;
    data.senderEmail = query.userName.toString();
    data.isStartCall = true;
    client.emit(`CONFERENCE-${data.groupId}-start`, data);
    client.broadcast.emit(
      `CONFERENCE-${data.groupId}-start`,
      data,
    );
    await this.chatService.sendConferenceToOfflineUsers(data);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('answer_call')
  async handleAnswerCall(
    @MessageBody() data: Conference,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('answer call data', data);
    const query = client.handshake.query;
    data.senderEmail = query.userName.toString();
    client.emit(`CONFERENCE-${data.groupId}-answer`, data);
    client.broadcast.emit(
      `CONFERENCE-${data.groupId}-answer`,
      data,
    );
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('leave_call')
  async handleLeaveCall(
    @MessageBody() data: Conference,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('leave call data', data);
    const query = client.handshake.query;
    data.senderEmail = query.userName.toString();
    client.emit(`CONFERENCE-${data.groupId}-leave`, data);
    client.broadcast.emit(
      `CONFERENCE-${data.groupId}-leave`,
      data,
    );
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('end_call')
  async handleEndCall(
    @MessageBody() data: Conference,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('end call data', data);
    const query = client.handshake.query;
    data.senderEmail = query.userName.toString();
    data.isStartCall = false;
    data.offer = null;
    client.emit(`CONFERENCE-${data.groupId}-end`, data);
    client.broadcast.emit(
      `CONFERENCE-${data.groupId}-end`,
      data,
    );
    await this.chatService.sendConferenceToOfflineUsers(data);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('ice_candidate')
  async handleIceCandidate(
    @MessageBody() data: Conference,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('call data', data);
    const query = client.handshake.query;
    data.senderEmail = query.userName.toString();
    client.emit(`CONFERENCE-${data.groupId}-ice_candidate`, data);
    client.broadcast.emit(
      `CONFERENCE-${data.groupId}-ice_candidate`,
      data,
    );
  }
}
