import { RequestHandler } from "express";
import passport from "passport";
import "../passport";

export const localAuth: RequestHandler = (req, res, next) => {
  res.send(req.user);
};

// export const googleAuth: RequestHandler = (req, res, next) => {};

// export const googleAuthCallback: RequestHandler = (req, res, next) => {};

// export const logout: RequestHandler = (req, res, next) => req.logout();
