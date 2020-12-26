import { Router } from "express";
import passport from "passport";
import { login } from "../controller/auth";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/checkAuth", isAuthenticated, login);
router.post("/local", passport.authenticate("local"), login);
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email"] }),
//   googleAuth
// );
// router.get("/google/callback", googleAuthCallback);

export default router;
