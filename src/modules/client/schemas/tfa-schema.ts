import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Client } from "./client.chema";

@Schema({ timestamps: true, collection: Tfa.name.toLowerCase() })
export class Tfa {

    @Prop({ required: true, type: String })
    secret: string;

    @Prop({ required: true, type: String })
    url: string;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Client.name }] })
    user: Client;
}

export const TfaSchema = SchemaFactory.createForClass(Tfa);