import { Document } from "mongoose";

export interface BaseInterface extends Document {

    createdAt: Date;
}
