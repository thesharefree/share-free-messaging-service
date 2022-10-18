import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Audit } from './audit';

@Schema()
export class UserGroupXref extends Audit {
  @Prop()
  userId: string;

  @Prop()
  groupId: string;
}

export type UserGroupXrefDocument = UserGroupXref & Document;
export const UserGroupXrefSchema = SchemaFactory.createForClass(UserGroupXref);
