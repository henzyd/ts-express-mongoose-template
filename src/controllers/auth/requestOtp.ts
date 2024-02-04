import ms from "ms";
import UserModel from "../../models/user";
import AppError from "../../utils/appError";
import catchAsync from "../../utils/catchAsync";
import { sendOtpMail } from "../../utils/email";
import OtpModel from "../../models/otp";

const requestNewOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({
    email,
  });

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  if (user.isVerified) {
    return next(new AppError("User already verified", 400));
  }

  //? Code needs to be unique incase if someone has an otp as someone else
  const otp = await OtpModel.create({
    code: Math.floor(100000 + Math.random() * 900000),
    expiresAt: new Date(Date.now() + ms("5m")),
    user: user._id,
  });

  try {
    await sendOtpMail({
      email: user.email,
      name: `${user.email}`,
      code: otp.code,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Failed to send otp email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "OTP sent successfully",
  });
});

export default requestNewOtp;
