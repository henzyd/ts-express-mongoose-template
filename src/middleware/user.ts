import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const adminAllowed = catchAsync(async (req, res, next) => {
  const user = req._currentUser;

  if (!(user.role === "admin")) {
    return next(new AppError("You are forbidden", 403));
  }

  next();
});
