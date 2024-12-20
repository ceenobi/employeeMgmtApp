import { Router } from "express";
import {
  authenticateEmployee,
  login,
  logout,
  refreshAccessToken,
  register,
  signInViaEmail,
  verifyEmail,
  verifyLoginLink,
} from "../controllers/auth.js";
import { verifyAuth, Roles } from "../middleware.js/verifyAuth.js";
import { authLimiter } from "../middleware.js/rateLimit.js";

const router = Router();

router.post("/register", verifyAuth(Roles.Admin), register);
router.post("/login", login);
router.post("/signinViaMail", authLimiter, signInViaEmail);

router.get(
  "/verifyLoginLink/:userId/:emailToken",
  authLimiter,
  verifyLoginLink
);

router.get(
  "/user",
  verifyAuth(Roles.All),
  // cacheMiddleware("auth_user", 300),
  authenticateEmployee
);

router.patch(
  "/verifyEmail/:userId/:verificationToken",
  // authLimiter,
  // cacheMiddleware("verify_email", 120),
  verifyEmail
);

router.post("/logout", logout);
router.get("/refreshAccessToken", refreshAccessToken);

export default router;
