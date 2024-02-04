import { Schema, model, Types } from "mongoose";

type User = {
  email: string;
  password?: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  lastLogin?: Date;
  oauthProviders: Types.ObjectId[];
  resetPasswordTokens: Types.ObjectId[];
  otps: Types.ObjectId[];
  profile: Types.ObjectId;
  fashOrgCart: Types.ObjectId;
  fashOrgOrders: Types.ObjectId[];
  fashOrgWishlist: Types.ObjectId[];
};

const schema = new Schema<User>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    oauthProviders: [
      {
        type: Schema.ObjectId,
        ref: "OAuthProvider",
      },
    ],
    resetPasswordTokens: [
      {
        type: Schema.ObjectId,
        ref: "ResetPasswordToken",
        select: false,
      },
    ],
    otps: [
      {
        type: Schema.ObjectId,
        ref: "Otp",
        select: false,
      },
    ],
    profile: {
      type: Schema.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<User>("User", schema);

export default UserModel;
