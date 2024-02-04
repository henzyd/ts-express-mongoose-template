import { body, validationResult } from "express-validator";
import { customErrorFormatter } from "./helper";
import AppError from "./appError";
import catchAsync from "./catchAsync";

const requestValidation = catchAsync(async (req, _, next) => {
  const errors = validationResult(req).formatWith(customErrorFormatter);
  if (!errors.isEmpty()) {
    return next(
      new AppError("Invalid request data", 400, errors.array().slice(-1))
    );
  }
  next();
});

export const emailVaidator = () =>
  body("email").trim().isEmail().withMessage("Invalid email address");

export const passwordValidator = () =>
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.");

export const refreshTokenValidator = () =>
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required");

export const firstNameVaidator = () =>
  body("firstName").trim().notEmpty().withMessage("First name is required");

export const lastNameVaidator = () =>
  body("lastName").trim().notEmpty().withMessage("Last name is required");

export default requestValidation;
