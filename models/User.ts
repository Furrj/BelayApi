import { Document, Schema, Model, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  location?: string;
}

const UserSchema = new Schema<IUser>({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  location: String,
});

model<IUser>("User", UserSchema);

export {};
