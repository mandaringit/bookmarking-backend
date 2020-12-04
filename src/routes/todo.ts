import { Router } from "express";
import { createTodo, getTodoById } from "../controller/todo";

const router = Router();

router.get("/", getTodoById);
router.post("/", createTodo);

export default router;
