import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import "../passport";
import passport from "passport";

function generateToken(payload: any, time: string | number) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: time,
  });
}

export const logout: RequestHandler = (req, res, next) => {
  req.logout();
  return res.status(200).send({ message: "로그아웃 성공" });
};

export const silentRefresh: RequestHandler = (req, res, next) => {
  if (!req.cookies["refreshToken"]) {
    return res.status(401).send();
  }

  const { refreshToken } = req.cookies;
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET);

    const newRefreshToken = generateToken({}, "1h");
    const newAccessToken = generateToken({}, "5m");
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        // sameSite: "none",
        // secure: true,
      })
      .send({ token: newAccessToken, user: {} });
  } catch (e) {
    return res.status(401).send();
  }
};
/**
 * 로컬 로그인 성공 요청시 핸들러. 실패는 패스포트 미들웨어쪽에서 401로 처리됨.
 */
export const login: RequestHandler = (req, res, next) => {
  const user = req.user as User;
  const refreshToken = generateToken({}, "1m");
  const accessToken = generateToken({ id: user.id }, "5m");

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // sameSite: "none",
      // secure: true,
    })
    .send({
      token: accessToken,
      user: { id: user.id, email: user.email, username: user.username },
    });
};

export const signup: RequestHandler = async (req, res, next) => {
  const userRepository = getRepository(User);
  const { email, password } = req.body;
  const findUser = await userRepository.findOne({ email });

  if (!email || !password) {
    return res.status(400).send({ message: "잘못된 형식입니다." });
  }

  if (findUser) {
    return res.status(409).send({ message: `이미 존재하는 이메일 입니다.` });
  }

  const user = new User();
  user.email = email;
  const hashedPassword = bcrypt.hashSync(password, 10);
  user.password = hashedPassword;
  await userRepository.save(user);

  // 다음 미들웨어로 넘겨줌
  next();
};
