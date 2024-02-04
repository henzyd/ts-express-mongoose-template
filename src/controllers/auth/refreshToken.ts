import { JwtPayload, verify as JwtVerify } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/appError";
import { JWT_SECRET } from "../../env";
import { signAccessToken } from "../../utils/jwt";
import BlacklistedTokenModel from "../../models/blacklistedToken";
import UserModel from "../../models/user";

const refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  let decoded: JwtPayload | string;
  try {
    decoded = JwtVerify(refreshToken, JWT_SECRET);
  } catch (error) {
    return next(new AppError("Invalid token", 400));
  }

  const blacklistedToken = await BlacklistedTokenModel.findOne({
    token: refreshToken,
  });

  if (blacklistedToken) {
    return next(new AppError("Not authorized", 401));
  }

  const { userId } = decoded as { userId: string; iat: number; exp: number };

  const user = await UserModel.findById(userId);

  if (!user) {
    return next(new AppError("Invalid token", 400));
  }

  const accessToken = signAccessToken(user.id);

  res.status(200).json({
    status: "success",
    message: "Access token refreshed successfully",
    data: {
      accessToken,
    },
  });
});

export default refreshAccessToken;
