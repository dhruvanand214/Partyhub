import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  planType: "FREE" | "PREMIUM";
  monthlyGenerations: number;
  lastGenerationDate: Date | null;
  savedPlans: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    planType: { type: String, enum: ["FREE", "PREMIUM"], default: "FREE" },
    monthlyGenerations: { type: Number, default: 0 },
    lastGenerationDate: { type: Date, default: null },
    savedPlans: [{ type: Schema.Types.ObjectId, ref: "PartyPlan" }],
  },
  { timestamps: true }
);

// Prevent mongoose from recompiling the model in dev mode
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
