import { Router } from "express";
import passport from "passport";
import { login, logout, signup } from "../controller/auth";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/logout", isAuthenticated, logout);
router.get("/checkAuth", isAuthenticated, login);
router.post("/local", passport.authenticate("local"), login);
// 가입 -> 패스포트 인증 -> 성공시 로그인
router.post("/signup", signup, passport.authenticate("local"), login);
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email"] }),
//   googleAuth
// );
// router.get("/google/callback", googleAuthCallback);

export default router;
