import { Schema, model } from "mongoose";

type BlacklistedToken = {
  token: string;
  blacklistedAt: Date;
};

const schema = new Schema<BlacklistedToken>({
  token: {
    type: String,
    required: [true, "token is reqiured"],
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
  },
});

const BlacklistedTokenModel = model("BlacklistedToken", schema);

export default BlacklistedTokenModel;
