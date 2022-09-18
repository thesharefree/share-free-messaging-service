import { Prop } from "@nestjs/mongoose";

export class Audit {

    @Prop()
    active: boolean;

    @Prop()
    createdBy: string;

    @Prop()
    createdDate: Date;

    @Prop()
    updatedBy: string;

    @Prop()
    updatedDate: Date;
}