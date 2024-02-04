import bcrypt from "bcryptjs";
import catchAsync from "../../utils/catchAsync";
import UserModel from "../../models/user";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import AppError from "../../utils/appError";

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({
    email,
  }).select("+password");

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  if (!user.password) {
    return next(new AppError("Invalid credentials", 400));
  }

  if (!user.isVerified) {
    return next(new AppError("User not verified", 400));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid credentials", 400));
  }

  user.lastLogin = new Date();

  await user.save();

  const userJson = user.toJSON();

  delete userJson.password;

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: {
      ...userJson,
      accessToken,
      refreshToken,
    },
  });
});

export default login;
