import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Location } from './location';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema()
export class User extends Location {
  @Prop({
    required: [true, 'Name is required'],
    minlength: [3, 'Must be at least 3 characters'],
  })
  name: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    minlength: [8, 'Must be at least 6 characters'],
  })
  email: string;

  @Prop({
    required: [true, 'Phone is required'],
    unique: true,
    minlength: [10, 'Must be at least 3 characters'],
  })
  phone: string;

  @Prop({
    required: [true, 'Roles is required'],
  })
  roles: string[];

  @Prop()
  intro: string;

  @Prop()
  onboarded: boolean;

  @Prop()
  sex: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  photoUrl: string;

  @Prop()
  registrationToken: string;

  @Prop()
  online: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
