import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClientProfileEnum } from '../enums/client-profile.enum';
import { ClientStatusEnum } from '../enums/client-status.enum';
import { HighlightStatusEnum } from '../enums/highlights-status.enum';


@Schema({ timestamps: true, collection: Client.name.toLowerCase() })
export class Client {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  cpf: string;

  @Prop({ required: false })
  cnpj: string;

  @Prop({ required: true, enum: Object.keys(ClientStatusEnum) })
  status: string;

  @Prop({ required: true, enum: Object.keys(ClientProfileEnum) })
  profile: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  document: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false, enum: Object.keys(HighlightStatusEnum) })
  highlights: string;
}
export const ClientSchema = SchemaFactory.createForClass(Client);
