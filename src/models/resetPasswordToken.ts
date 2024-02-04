import { Schema, Types, model } from "mongoose";

type ResetPasswordToken = {
  token: string;
  createdAt: Date;
  expiresAt: Date;
  user: Types.ObjectId;
};

const schema = new Schema<ResetPasswordToken>({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const ResetPasswordTokenModel = model("ResetPasswordToken", schema);

export default ResetPasswordTokenModel;
