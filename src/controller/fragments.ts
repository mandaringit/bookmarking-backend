import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Fragment } from "../entity/Fragment";
import { Report } from "../entity/Report";
import { User } from "../entity/User";

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
