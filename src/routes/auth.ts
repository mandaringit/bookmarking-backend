import { Router } from "express";
import passport from "passport";
import { login, logout, signup, silentRefresh } from "../controller/auth";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/logout", isAuthenticated, logout);
router.get("/checkAuth", silentRefresh);
router.post("/local", passport.authenticate("local"), login);
// 가입 -> 패스포트 인증 -> 성공시 로그인
router.post("/signup", signup, passport.authenticate("local"), login);

export default router;
