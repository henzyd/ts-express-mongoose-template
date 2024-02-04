import { Schema, model, Types } from "mongoose";

type OAuthProvider = {
  code: number;
  createdAt: Date;
  expiresAt: Date;
  user: Types.ObjectId;
};

const schema = new Schema<OAuthProvider>({
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

const OAuthProviderModel = model("OAuthProvider", schema);

export default OAuthProviderModel;
