import { Schema, Types, model } from "mongoose";

type Profile = {
  firstName: string;
  lastName: string;
  user: Types.ObjectId;
};

const schema = new Schema<Profile>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
});

const ProfileModel = model<Profile>("Profile", schema);

export default ProfileModel;
