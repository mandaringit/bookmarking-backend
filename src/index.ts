import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import logger from "morgan";
import authRoutes from "./routes/auth";
import reportsRoutes from "./routes/reports";
import fragmentRoutes from "./routes/fragments";
import naverApiRoutes from "./routes/naverApi";
import kakaoApiRoutes from "./routes/kakaoApi";
import libraryRoutes from "./routes/library";
import wishRoutes from "./routes/wish";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(logger("dev"));

    /**
     * 세션 설정
     */
    app.use(
      session({
        secret: "SECRET_CODE",
        cookie: { maxAge: 60 * 60 * 60 * 1000 },
        resave: false,
        saveUninitialized: false,
      })
    );

    /**
     * 패스포트
     */
    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/", (req, res) => {
      res.json({
        message: "welcome to bookmarking api",
      });
    });
    /**
     * 라우터
     */
    app.use("/auth", authRoutes);
    app.use("/reports", reportsRoutes);
    app.use("/fragments", fragmentRoutes);
    app.use("/wishes", wishRoutes);

    /**
     * 외부 API
     */
    app.use("/library", libraryRoutes);
    app.use("/naver/search/book", naverApiRoutes);
    app.use("/kakao/search/book", kakaoApiRoutes);

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
