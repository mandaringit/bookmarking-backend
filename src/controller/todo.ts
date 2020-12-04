import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Todo } from "../entity/Todo";

export const getTodoById: RequestHandler = async (req, res, next) => {
  const todoRepository = getRepository(Todo);
  const todo = await todoRepository.findOne(1);
  res.status(200).json({ message: "success", todo });
};

export const createTodo: RequestHandler = async (req, res, next) => {
  // 생성 로직
  let todo = new Todo();
  todo.text = "오늘 이거 해야지";

  const todoRepository = getRepository(Todo);
  const savedTodo = await todoRepository.save(todo);

  console.log(`SAVED! ${savedTodo.text} ${savedTodo.createdAt}`);

  res.status(201).json({ message: "success", todo: savedTodo });
};
