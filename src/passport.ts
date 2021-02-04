import passport from "passport";
import JWTStrategy, { ExtractJwt } from "passport-jwt";
import LocalStrategy from "passport-local";
import { getRepository } from "typeorm";
import { User } from "./entity/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

passport.serializeUser((user: User, done) => {
  // 로그인한 뒤, 세션에 어떤 정보를 저장할 것인지 결정할 콜백 함수.
  done(null, user.email); // user객체가 deserializeUser로 전달됨.
});

passport.deserializeUser(async (email, done) => {
  // 세션에 저장한 데이터로 로그인한 유저 정보를 복구하는데 이걸 결정하는 함수
  const userRepository = getRepository(User);
  const findUser = await userRepository.findOne({ where: { email } });
  if (!findUser) {
    return done(null, false);
  }
  // 여기의 user가 req.user가 됨
  done(null, {
    id: findUser.id,
    email: findUser.email,
    googleId: findUser.googleId,
    username: findUser.username,
  });
});

// 로컬전략 옵션
const localStrategyOption = {
  usernameField: "email",
  passwordField: "password",
  session: true,
};

// 로컬 전략
const localVerify = async (email: string, password: string, done) => {
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ email });
    bcrypt.compare(password, user.password, (err, same) => {
      if (same) {
        return done(null, user);
      }
      return done(err, false);
    });
  } catch (e) {
    done(e);
  }
};

// JWT 전략 옵션
const jwtStrategyOption: JWTStrategy.StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// JWT 전략
const jwtVerify = async (jwtPayload: Partial<User>, done) => {
  const { id } = jwtPayload;
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne(id);
    return done(null, user);
  } catch (e) {
    done(e);
  }
};

passport.use(new JWTStrategy.Strategy(jwtStrategyOption, jwtVerify));
passport.use(new LocalStrategy.Strategy(localStrategyOption, localVerify));
