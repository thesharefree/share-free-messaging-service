import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultApp } from '../auth/firebaseAdmin';
import { User, UserDocument } from 'src/entities/user.entity';
import { Group, GroupDocument } from 'src/entities/group.entity';
import {
  Message,
  MessageDocument,
  RecipientType,
} from 'src/entities/message.entity';
import {
  UserGroupXref,
  UserGroupXrefDocument,
} from 'src/entities/user-group-xref.entity';
import { messaging } from 'firebase-admin';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(UserGroupXref.name)
    private readonly userGroupXrefModel: Model<UserGroupXrefDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  private allUsers = [];
  private connectedUsers = [];

  async saveMessage(message: Message): Promise<void> {
    const user = await this.userModel.findOne({ email: message.senderEmail });
    message.sender = user._id;
    message.senderName = user.name;
    message['_id'] = null;
    message.active = true;
    message.createdBy = user.email;
    message.createdDate = new Date();
    message.updatedBy = user.email;
    message.updatedDate = new Date();
    const createdMessage = new this.messageModel(message);
    await createdMessage.save();
  }

  async userConnected(userEmail: string, registrationToken: string) {
    const user = await this.userModel.findOne({ email: userEmail });
    await this.userModel.updateOne(
      { _id: user._id },
      {
        registrationToken: registrationToken,
        online: true,
        updatedBy: userEmail,
        updatedDate: new Date(),
      },
    );
    console.log('User Online', userEmail);
  }

  async userDisconnected(userEmail: string) {
    const user = await this.userModel.findOne({ email: userEmail });
    await this.userModel.updateOne(
      { _id: user._id },
      {
        online: false,
        updatedBy: userEmail,
        updatedDate: new Date(),
      },
    );
    console.log('User Offline', userEmail);
  }

  async sendMessageToOfflineUsers(message: Message) {
    const user = await this.userModel.findOne({ email: message.senderEmail });
    var messagePayload: messaging.MulticastMessage = {
      data: {
        type: 'CHAT',
        title: '',
        message: message.message,
        recipientId: message.recipientId,
        recipientType: message.recipientType,
        sender: user._id.toString(),
        senderName: user.name,
        senderEmail: user.email,
        createdBy: user.email,
        createdDate: message.createdDate.toISOString(),
      },
      tokens: [],
    };
    if (RecipientType.GROUP == message.recipientType) {
      const group = await this.groupModel.findById(message.recipientId);
      const owner = await this.userModel.findOne({ email: group.owner });
      const xrefResp = await this.userGroupXrefModel.find({
        groupId: group._id,
      });
      let userIds = xrefResp.map((xref) => {
        return xref.userId;
      });
      userIds.push(owner._id.toString());
      userIds = userIds.filter((userId) => userId != user._id.toString());
      console.log(userIds);
      const users = await this.userModel.where('_id').in(userIds);
      const userTokens = users
        .filter((user) => user.online === false)
        .map((user) => {
          return user.registrationToken;
        });
      messagePayload.tokens = userTokens;
      messagePayload.data.title = group.name;
    } else {
      const recipient = await this.userModel.findById(message.recipientId);
      if (recipient == null || recipient.online) {
        return;
      }
      messagePayload.tokens.push(recipient.registrationToken);
      messagePayload.data.title = user.name;
    }
    try {
      await defaultApp.messaging().sendMulticast(messagePayload);
    } catch (ex) {
      console.log(JSON.stringify(ex));
    }
  }
}
