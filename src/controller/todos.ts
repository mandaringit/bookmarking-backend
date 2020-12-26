import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Todo } from "../entity/Todo";
import { User } from "../entity/User";

// export const getTodoById: RequestHandler<{ todoId: number }> = async (
//   req,
//   res,
//   next
// ) => {
//   const { todoId } = req.params;
//   const todoRepository = getRepository(Todo);
//   const todo = await todoRepository.findOne(todoId);
//   if (!todo) {
//     res.status(404).json({ message: "찾을 수 없는 할일입니다." });
//     return;
//   }
//   res.status(200).json(todo);
// };

export const getTodos: RequestHandler = async (req, res, next) => {
  const { id } = req.user as User;
  const todoRepository = getRepository(Todo);
  const todos = await todoRepository.find({
    where: { user: { id } },
    order: { createdAt: "DESC" },
  });
  return res.status(200).json(todos);
};

export const createTodo: RequestHandler<{}, {}, { text: string }> = async (
  req,
  res,
  next
) => {
  const userRepository = getRepository(User);
  const todoRepository = getRepository(Todo);

  // 현재 유저 찾기
  const { id } = req.user as User;
  const user = await userRepository.findOne(id);

  const { text } = req.body;
  let todo = new Todo();
  todo.text = text;
  todo.user = user;

  const savedTodo = await todoRepository.save(todo);

  return res.status(201).json(savedTodo);
};

export const removeTodo: RequestHandler<{ todoId: number }> = async (
  req,
  res,
  next
) => {
  const { id } = req.user as User;
  const { todoId } = req.params;

  const todoRepository = getRepository(Todo);
  // 추가적인 관계를 원하면 명시를 해줘야만 한다.
  const selectedTodo = await todoRepository.findOne(todoId, {
    relations: ["user"],
  });

  if (!selectedTodo) {
    return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
  }

  if (selectedTodo.user.id !== id) {
    return res.status(401).send({ message: "권한이 없습니다." });
  }

  await todoRepository.remove(selectedTodo);
  return res.status(204).json({ message: "성공적으로 삭제되었습니다." });
};

export const updateTodoText: RequestHandler<
  { todoId: number },
  {},
  { text: string }
> = async (req, res, next) => {
  const todoRepository = getRepository(Todo);

  const { id } = req.user as User;
  const { todoId } = req.params;
  const { text } = req.body;
  const selectedTodo = await todoRepository.findOne(todoId, {
    relations: ["user"],
  });

  if (!selectedTodo) {
    res.status(404).json({ message: "할일을 찾을 수 없습니다." });
    return;
  }

  if (selectedTodo.user.id !== id) {
    return res.status(401).send({ message: "권한이 없습니다." });
  }

  selectedTodo.text = text;
  await todoRepository.save(selectedTodo);

  return res.status(200).json(selectedTodo);
};

export const toggleTodo: RequestHandler<{ todoId: number }> = async (
  req,
  res,
  next
) => {
  const { id } = req.user as User;
  const { todoId } = req.params;
  const todoRepository = getRepository(Todo);
  const selectedTodo = await todoRepository.findOne(todoId, {
    relations: ["user"],
  });

  if (!selectedTodo) {
    return res.status(404).json({ message: "할일을 찾을 수 없습니다." });
  }

  if (selectedTodo.user.id !== id) {
    return res.status(401).send({ message: "권한이 없습니다." });
  }

  selectedTodo.done = !selectedTodo.done;
  await todoRepository.save(selectedTodo);

  return res.status(200).json(selectedTodo);
};
