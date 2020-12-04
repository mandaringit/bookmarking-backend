import { Router } from "express";
import {
  createTodo,
  getTodoById,
  getTodos,
  removeTodo,
  toggleTodo,
  updateTodoText,
} from "../controller/todo";

const router = Router();

router.get("/", getTodoById);
router.get("/all", getTodos);
router.post("/", createTodo);
router.delete("/", removeTodo);
router.patch("/", updateTodoText);
router.patch("/toggle", toggleTodo);

export default router;
