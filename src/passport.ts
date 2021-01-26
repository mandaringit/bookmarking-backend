import passport from "passport";
import GoogleStrategy from "passport-google-oauth";
import LocalStrategy from "passport-local";
import { getRepository } from "typeorm";
import { User } from "./entity/User";
import bcrypt from "bcryptjs";

passport.serializeUser((user: User, done) => {
  // 로그인한 뒤, 세션에 어떤 정보를 저장할 것인지 결정할 콜백 함수.
  done(null, user.email); // user객체가 deserializeUser로 전달됨.
});

passport.deserializeUser(async (email, done) => {
  // 세션에 저장한 데이터로 로그인한 유저 정보를 복구하는데 이걸 결정하는 함수
  const userRepository = getRepository(User);
  const findUser = await userRepository.findOne(email);
  if (!findUser) {
    done(false);
  }

  // 여기의 user가 req.user가 됨
  done(null, {
    id: findUser.id,
    email: findUser.email,
    googleId: findUser.googleId,
    username: findUser.username,
  });
});

passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
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
    }
  )
);
