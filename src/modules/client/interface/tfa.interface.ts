import { Document } from "mongoose";
import { ClientInterface} from "./user.interface";

export interface TfaInterface extends Document {
    readonly secret: string;
    readonly url: string;
    readonly user: ClientInterface;
}