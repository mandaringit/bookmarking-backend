import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import "../passport";

export const logout: RequestHandler = (req, res, next) => {
  req.logout();
  return res.status(200).send({ message: "로그아웃 성공" });
};

/**
 * 로컬 로그인 성공 요청시 핸들러. 실패는 패스포트 미들웨어쪽에서 401로 처리됨.
 */
export const login: RequestHandler = (req, res, next) => {
  const { id, email, googleId, username } = req.user as User;
  return res.status(200).send({
    id,
    email,
    googleId,
    username,
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

// export const googleAuth: RequestHandler = (req, res, next) => {};

// export const googleAuthCallback: RequestHandler = (req, res, next) => {};

// export const logout: RequestHandler = (req, res, next) => req.logout();
