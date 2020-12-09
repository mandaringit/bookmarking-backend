import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import logger from "morgan";
import todosRoutes from "./routes/todos";
import cors from "cors";

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    app.use(express.json());
    app.use(logger("dev"));

    app.use("/todos", todosRoutes);

    app.listen(8080, () => {
      console.log("Listen on port 8080");
    });
  })
  .catch((error) => console.log(error));
