import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import todoRoutes from "./routes/todo";

createConnection()
  .then(async (connection) => {
    const app = express();
    app.use(express.json());

    app.use("/todo", todoRoutes);

    app.listen(3000, () => {
      console.log("Listen on port 3000");
    });
  })
  .catch((error) => console.log(error));
