import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "vendor" | "buyer";
  name: string;
  image: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["vendor", "buyer"], required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
