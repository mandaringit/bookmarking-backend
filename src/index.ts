import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import logger from "morgan";
import todosRoutes from "./routes/todos";
import authRoutes from "./routes/auth";
import cors from "cors";
import passport from "passport";
import session from "express-session";

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    app.use(express.json());
    app.use(logger("dev"));
    app.use(
      session({
        secret: "SECRET_CODE",
        cookie: { maxAge: 60 * 60 * 1000 },
        resave: false,
        saveUninitialized: false,
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/todos", todosRoutes);
    app.use("/auth", authRoutes);

    // 디버그용 엔드포인트
    app.get("/debug", (req, res) => {
      res.json({
        "req.session": req.session, // 세션 데이터
        "req.user": req.user, // 유저 데이터(뒷 부분에서 설명)
        // @ts-ignore
        "req._passport": req._passport, // 패스포트 데이터(뒷 부분에서 설명)})
      });
    });

    app.listen(8080, () => {
      console.log("Listen on port 8080");
    });
  })
  .catch((error) => console.log(error));
