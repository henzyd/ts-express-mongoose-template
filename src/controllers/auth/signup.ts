import ms from "ms";
import UserModel from "../../models/user";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { hashPasswordHandler } from "../../utils/helper";
import { sendOtpMail } from "../../utils/email";
import OtpModel from "../../models/otp";
import UserProfileModel from "../../models/userProfile";

const signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const user = await UserModel.findOne({
    email,
  });

  if (user) {
    return next(new AppError("User already exist", 400));
  }

  const hashedPassword = await hashPasswordHandler(password);

  const profile = new UserProfileModel({
    firstName,
    lastName,
  });

  const newUser = new UserModel({
    email,
    password: hashedPassword,
    profile: profile._id,
  });

  newUser.role = role ?? newUser.role;

  await newUser.save();

  profile.user = newUser._id;

  await profile.save();

  const otp = await OtpModel.create({
    code: Math.floor(100000 + Math.random() * 900000),
    expiresAt: new Date(Date.now() + ms("5m")),
    user: newUser._id,
  });

  try {
    await sendOtpMail({
      email: newUser?.email,
      name: `${profile.firstName} ${profile.lastName}`,
      code: otp.code,
    });
  } catch (error) {
    return next(new AppError("Failed to send otp email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "User signedup successfully",
  });
});

export default signup;
