import { Schema, Types, model } from "mongoose";

type Otp = {
  code: number;
  createdAt: Date;
  expiresAt: Date;
  user: Types.ObjectId;
};

const schema = new Schema<Otp>({
  code: {
    type: Number,
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

const OtpModel = model("Otp", schema);

export default OtpModel;
