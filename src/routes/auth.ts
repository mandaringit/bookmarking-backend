import { RequestHandler, Router } from "express";
import passport from "passport";
import { login } from "../controller/auth";

const router = Router();

const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    return res.status(401).send({ error: "인증되지 않은 유저" });
  }
};

router.get("/checkAuth", isAuthenticated, login);
router.post("/local", passport.authenticate("local"), login);
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["email"] }),
//   googleAuth
// );
// router.get("/google/callback", googleAuthCallback);

export default router;
