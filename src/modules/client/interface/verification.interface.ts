import { Document } from "mongoose";
import { ClientInterface } from "./user.interface";


export interface VerificationInterface extends Document {
    readonly attempt: number;
    readonly deadline: Date;
    readonly user: ClientInterface;
    readonly code: number;
}