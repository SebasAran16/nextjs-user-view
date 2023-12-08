import { Schema } from "mongoose";

export interface IUser {
  _id: Schema.Types.ObjectId;
  username: string;
  firstname?: string;
  lastname?: string;
  image?: string;
  email: string;
  is_verified: boolean;
  created_date: Date;
}
