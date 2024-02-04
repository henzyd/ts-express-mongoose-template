import crypto from "crypto";
import ms from "ms";
import UserModel from "../../models/user";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import ResetPasswordTokenModel from "../../models/resetPasswordToken";
import { sendPasswordResetMail } from "../../utils/email";

const resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({
    email,
  });

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  const token = crypto.randomBytes(32).toString("hex");

  const tokenExpiration = Date.now() + ms("2h");

  const resetPasswordToken = await ResetPasswordTokenModel.create({
    token,
    expiresAt: new Date(tokenExpiration),
    user: user._id,
  });

  const resetPasswordUrl = `${req.headers.referer}reset-password?token=${resetPasswordToken.token}&userId=${user.id}`;

  try {
    await sendPasswordResetMail(email, resetPasswordUrl);
  } catch (error) {
    return next(new AppError("Failed to send email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset token sent successfully",
  });
});

export default resetPassword;
