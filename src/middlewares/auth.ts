import { RequestHandler } from "express";
import passport from "passport";

export const isAuthenticated: RequestHandler = (req, res, next) =>
  passport.authenticate("jwt", { session: false })(req, res, next);
