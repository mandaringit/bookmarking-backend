import { Router } from "express";
import {
  createTodo,
  getTodoById,
  getTodos,
  removeTodo,
  toggleTodo,
  updateTodoText,
} from "../controller/todos";

const router = Router();

router.get("/:todoId", getTodoById);
router.get("/", getTodos);
router.post("/", createTodo);
router.delete("/:todoId", removeTodo);
router.patch("/:todoId", updateTodoText);
router.patch("/:todoId/toggle", toggleTodo);

export default router;
