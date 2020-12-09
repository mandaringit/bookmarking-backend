import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Todo } from "../entity/Todo";

export const getTodoById: RequestHandler<{ todoId: number }> = async (
  req,
  res,
  next
) => {
  const { todoId } = req.params;
  const todoRepository = getRepository(Todo);
  const todo = await todoRepository.findOne(todoId);
  if (!todo) {
    res.status(404).json({ message: "찾을 수 없는 할일입니다." });
    return;
  }
  res.status(200).json(todo);
};

export const getTodos: RequestHandler = async (req, res, next) => {
  const todoRepository = getRepository(Todo);
  const todos = await todoRepository.find({ order: { createdAt: "DESC" } });
  res.status(200).json(todos);
};

export const createTodo: RequestHandler<{}, {}, { text: string }> = async (
  req,
  res,
  next
) => {
  const { text } = req.body;
  // 생성 로직
  let todo = new Todo();
  todo.text = text;

  const todoRepository = getRepository(Todo);
  const savedTodo = await todoRepository.save(todo);

  console.log(`SAVED! ${savedTodo.text} ${savedTodo.createdAt}`);

  res.status(201).json(savedTodo);
};

export const removeTodo: RequestHandler<{ todoId: number }> = async (
  req,
  res,
  next
) => {
  const { todoId } = req.params;

  const todoRepository = getRepository(Todo);
  const selectedTodo = await todoRepository.findOne(todoId);
  if (!selectedTodo) {
    res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    return;
  }

  await todoRepository.remove(selectedTodo);
  res.status(204).json({ message: "성공적으로 삭제되었습니다." });
};

export const updateTodoText: RequestHandler<
  { todoId: number },
  {},
  { text: string }
> = async (req, res, next) => {
  const { todoId } = req.params;
  const { text } = req.body;
  const todoRepository = getRepository(Todo);
  const selectedTodo = await todoRepository.findOne(todoId);
  if (!selectedTodo) {
    res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    return;
  }

  selectedTodo.text = text;
  await todoRepository.save(selectedTodo);
  res.status(200).json(selectedTodo);
};

export const toggleTodo: RequestHandler<{ todoId: number }> = async (
  req,
  res,
  next
) => {
  const { todoId } = req.params;
  const todoRepository = getRepository(Todo);
  const selectedTodo = await todoRepository.findOne(todoId);
  if (!selectedTodo) {
    res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    return;
  }

  selectedTodo.done = !selectedTodo.done;
  await todoRepository.save(selectedTodo);
  res.status(200).json(selectedTodo);
};
