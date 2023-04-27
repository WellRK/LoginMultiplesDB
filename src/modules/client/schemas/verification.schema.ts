import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Client } from "./client.chema";

@Schema({ timestamps: true, collection: Verification.name.toLowerCase() })
export class Verification {

    @Prop({ type: Number, required: true })
    attempt: number;

    @Prop({ type: Date, required: true })
    deadline: string;

    @Prop({ required: true, unique: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Client.name }] })
    user: Client;

    @Prop({ type: Number, required: true })
    code: number;
}
export const VerificationSchema = SchemaFactory.createForClass(Verification);