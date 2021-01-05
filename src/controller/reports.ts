import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { Report } from "../entity/Report";
import { User } from "../entity/User";

export const findMyReports: RequestHandler = async (req, res, next) => {
  const currentUser = req.user as User;
  const reportRepository = getRepository(Report);
  const reports = await reportRepository.find({
    where: { user: currentUser },
    relations: ["book"],
  });
  return res.status(200).send(reports);
};

export const createReport: RequestHandler = async (req, res, next) => {
  // TODO: bookInfo 타입 정의하기. NaverBook 타입
  // 여기서 title은 리포트의 타이틀임.
  const { bookInfo, title } = req.body;
  const currentUser = req.user as User;

  // 1. Author 찾기 & 만들기
  const authorRepository = getRepository(Author);
  let author = await authorRepository.findOne({
    name: bookInfo.authors[0], // name은 유니크함
  });

  if (!author) {
    author = new Author();
    author.name = bookInfo.authors[0];
  }

  // 2. Book 찾기 & 만들기
  const bookRepository = getRepository(Book);
  let book = await bookRepository.findOne({ isbn: bookInfo.isbn });
  if (!book) {
    book = new Book();
    book.title = bookInfo.title;
    book.thumbnail = bookInfo.thumbnail;
    book.isbn = bookInfo.isbn;
    book.author = author; // author 객체.
  }

  // 3. Report 찾기 & 만들기
  const reportRepository = getRepository(Report);
  let report = await reportRepository.findOne({
    where: { book, user: currentUser }, // 책과 유저가 동일한 경우. 그러니까 이 책에 대한 리포트를 가지고있는지 확인
  });

  if (!report) {
    report = new Report();
    report.title = title;
    report.user = currentUser;
    report.book = book;

    // 존재하지 않는 리포트인 경우에만 마지막에 각 객체들 DB에 반영?
    await authorRepository.save(author);
    await bookRepository.save(book);
    await reportRepository.save(report);

    return res.status(201).send(report);
  }

  return res.status(409).send({ message: "이미 존재하는 리포트입니다." });
};
