import ResetPasswordTokenModel from "../../models/resetPasswordToken";
import UserModel from "../../models/user";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { hashPasswordHandler } from "../../utils/helper";

const resetPasswordConfirm = catchAsync(async (req, res, next) => {
  const { userId, token, newPassword } = req.body;

  const resetPasswordToken = await ResetPasswordTokenModel.findOne({
    token,
  }).select("user");

  if (!resetPasswordToken) {
    return next(new AppError("Invalid token", 400));
  }

  if (resetPasswordToken.expiresAt < new Date()) {
    return next(new AppError("Token expired", 400));
  }

  const hashedPassword = await hashPasswordHandler(newPassword);

  //? This does not make sense
  try {
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  } catch (error) {
    return next(new AppError("User not found", 404));
  }

  //? Note
  await resetPasswordToken.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});

export default resetPasswordConfirm;
