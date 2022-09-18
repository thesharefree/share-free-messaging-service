import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/entities/group.entity';
import {
  UserGroupXref,
  UserGroupXrefSchema,
} from 'src/entities/user-group-xref.entity';
import { User, UserSchema } from 'src/entities/user.entity';
import { Message, MessageSchema } from '../entities/message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([
      { name: UserGroupXref.name, schema: UserGroupXrefSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
