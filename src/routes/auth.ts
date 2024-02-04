import express from "express";
import { body } from "express-validator";
import { authorization } from "../middleware/auth";
import signup from "../controllers/auth/signup";
import login from "../controllers/auth/login";
import logout from "../controllers/auth/logout";
import refreshAccessToken from "../controllers/auth/refreshToken";
import resetPassword from "../controllers/auth/resetPassword";
import resetPasswordConfirm from "../controllers/auth/resetPasswordConfirm";
import requestNewOtp from "../controllers/auth/requestOtp";
import verifyOtp from "../controllers/auth/verifyOtp";
import requestValidation, {
  emailVaidator,
  firstNameVaidator,
  lastNameVaidator,
  passwordValidator,
  refreshTokenValidator,
} from "../utils/validator";

const router = express.Router();

router.post(
  "/signup",
  [
    firstNameVaidator(),
    lastNameVaidator(),
    emailVaidator(),
    passwordValidator(),
    body("role").optional(),
  ],
  requestValidation,
  signup
);

router.post(
  "/login",
  [emailVaidator(), passwordValidator()],
  requestValidation,
  login
);

router.post(
  "/logout",
  authorization,
  [refreshTokenValidator()],
  requestValidation,
  logout
);

router.post(
  "/refresh-token",
  [refreshTokenValidator()],
  requestValidation,
  refreshAccessToken
);

router.post(
  "/reset-password",
  [emailVaidator()],
  requestValidation,
  resetPassword
);

router.post(
  "/reset-password-confirm",
  [
    body("userId").trim().notEmpty().withMessage("User id is required"),
    body("token").trim().notEmpty().withMessage("Token is required"),
    body("newPassword")
      .trim()
      .isLength({ min: 8 })
      .withMessage("New Password must be at least 8 characters long"),
  ],
  requestValidation,
  resetPasswordConfirm
);

router.post(
  "/verify-otp",
  [
    body("code")
      .notEmpty()
      .isInt()
      .isLength({ min: 6, max: 6 })
      .withMessage("Invalid OTP code, must be 6 digits long"),
  ],
  requestValidation,
  verifyOtp
);

router.post("/resend-otp", [emailVaidator()], requestValidation, requestNewOtp);

export default router;
