import passport from "passport";
import GoogleStrategy from "passport-google-oauth";
import LocalStrategy from "passport-local";
import { getRepository } from "typeorm";
import { User } from "./entity/User";

passport.serializeUser<User, string>((user, done) => {
  // 로그인한 뒤, 세션에 어떤 정보를 저장할 것인지 결정할 콜백 함수.
  done(null, user.email); // user객체가 deserializeUser로 전달됨.
});

passport.deserializeUser<Partial<User>, string>(async (email, done) => {
  // 세션에 저장한 데이터로 로그인한 유저 정보를 복구하는데 이걸 결정하는 함수
  const userRepository = getRepository(User);
  const findUser = await userRepository.findOne({ email });
  if (!findUser) {
    done(false);
  }

  done(null, {
    id: findUser.id,
    email: findUser.email,
    googleId: findUser.googleId,
  }); // 여기의 user가 req.user가 됨
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
        done(null, user ? user : false);
      } catch (e) {
        done(e);
      }
    }
  )
);

// Google 인증
// passport.use(
//   new GoogleStrategy.OAuth2Strategy(
//     {
//       clientID:
//         "640212556432-2d8tobdibkfrtqlgvig0bc1tngve7576.apps.googleusercontent.com",
//       clientSecret: "fDuLAJ3SSkIPmUnD7PG5vf9v",
//       callbackURL: "http://localhost:8080/auth/google/callback",
//     },
//     async function (accessToken, refreshToken, user, done) {
//       const userRepository = getRepository(User);
//       const findUser = await userRepository.findOne({ googleId: user.id });
//       console.log(user);
//       if (!findUser) {
//         const newUser = new User();
//         newUser.googleId = user.id;
//         newUser.email = user.emails.length > 0 ? user.emails[0].value : "";
//         userRepository.save(newUser);
//       }
//       return done(null, user);
//     }
//   )
// );
