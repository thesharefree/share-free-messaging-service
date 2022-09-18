import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Audit } from "./audit";

export enum RecipientType {
    USER = 'USER',
    GROUP = 'GROUP'
}

@Schema()
export class Message extends Audit {

    @Prop({
        required: [true, 'Topic message is required'],
        minlength: [1, 'Must be at least 1 character'],
    })
    message: string;

    @Prop({ required: [true, 'Sender is required'] })
    sender: string;

    @Prop({ required: [true, 'SenderName is required'] })
    senderName: string;

    @Prop({ required: [true, 'SenderEmail is required'] })
    senderEmail: string;

    @Prop({ required: [true, 'recipientId is required'] })
    recipientId: string;

    @Prop({
        required: [true, 'RecipientType is required']
    })
    recipientType: string;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);