
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "vendor" | "buyer";
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["vendor", "buyer"], required: true },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
