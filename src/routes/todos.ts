import { Router } from "express";
import {
  createTodo,
  getTodos,
  removeTodo,
  toggleTodo,
  updateTodoText,
} from "../controller/todos";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/", isAuthenticated, getTodos);
router.post("/", isAuthenticated, createTodo);
router.delete<null>("/:todoId", isAuthenticated, removeTodo);
router.patch<null>("/:todoId", isAuthenticated, updateTodoText);
router.patch<null>("/:todoId/toggle", isAuthenticated, toggleTodo);

export default router;
