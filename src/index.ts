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
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "https://master.dn1e3ltunjudd.amplifyapp.com",
        ],
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(express.json());
    app.use(logger("dev"));

    /**
     * 패스포트
     */
    app.use(passport.initialize());

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

    app.listen(8080, () => {
      console.log("Listen on port 8080");
    });
  })
  .catch((error) => console.log(error));
