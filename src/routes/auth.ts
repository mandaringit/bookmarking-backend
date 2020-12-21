import { Router } from "express";
import passport from "passport";
import { localAuth } from "../controller/auth";

const router = Router();

router.post("/local", passport.authenticate("local"), localAuth);
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email"] }),
//   googleAuth
// );
// router.get("/google/callback", googleAuthCallback);

export default router;
