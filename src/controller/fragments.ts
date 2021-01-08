import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Fragment } from "../entity/Fragment";
import { Report } from "../entity/Report";
import { User } from "../entity/User";

type FragmentIdRequestHandler = RequestHandler<
  any,
  any,
  any,
  { fragmentId: string }
>;

export const createFragment: RequestHandler = async (req, res, next) => {
  const fragmentRepository = getRepository(Fragment);
  const reportRepository = getRepository(Report);
  const currentUser = req.user as User;
  const { reportId, text } = req.body;

  const findReport = await reportRepository.findOne(reportId, {
    relations: ["user"],
  });
  if (!findReport)
    return res.status(404).send({ message: "찾을 수 없는 독후감입니다." });
  if (findReport.user.id !== currentUser.id)
    return res.status(401).send({ message: "권한이 없습니다." });

  const fragment = new Fragment();
  fragment.report = findReport;
  fragment.user = currentUser;
  fragment.text = text;

  await fragmentRepository.save(fragment);

  delete fragment.user;
  delete fragment.report;

  return res.status(201).send(fragment);
};

export const removeFragment: FragmentIdRequestHandler = async (
  req,
  res,
  next
) => {
  const { fragmentId } = req.query;
  const currentUser = req.user as User;
  const fragmentRepository = getRepository(Fragment);

  const findFragment = await fragmentRepository.findOne(fragmentId, {
    relations: ["user"],
  });

  if (!findFragment)
    return res.status(404).send({ message: "요소를 찾을 수 없습니다." });

  if (findFragment.user.id !== currentUser.id) {
    return res.status(401).send({ message: "권한이 없습니다." });
  }

  await fragmentRepository.remove(findFragment);

  return res.status(200).send({ id: fragmentId });
};
