import { verify as JwtVerify } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { JWT_SECRET } from "../../env";
import AppError from "../../utils/appError";
import BlacklistedTokenModel from "../../models/blacklistedToken";

const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    JwtVerify(refreshToken, JWT_SECRET);
  } catch (error) {
    return next(new AppError("Invalid token", 400));
  }

  try {
    await BlacklistedTokenModel.create({
      token: refreshToken,
    });
  } catch (error) {
    return next(new AppError("Token already blacklisted", 400));
  }

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export default logout;
