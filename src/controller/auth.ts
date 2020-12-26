import { RequestHandler } from "express";
import { User } from "../entity/User";
import "../passport";

/**
 * 로컬 로그인 성공 요청시 핸들러. 실패는 패스포트 미들웨어쪽에서 401로 처리됨.
 * @param req
 * @param res
 * @param next
 */
export const login: RequestHandler = (req, res, next) => {
  const { id, email, googleId, username } = req.user as User;
  res.status(200).send({
    id,
    email,
    googleId,
    username,
  });
};

// export const googleAuth: RequestHandler = (req, res, next) => {};

// export const googleAuthCallback: RequestHandler = (req, res, next) => {};

// export const logout: RequestHandler = (req, res, next) => req.logout();
