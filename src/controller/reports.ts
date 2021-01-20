import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { Report } from "../entity/Report";
import { User } from "../entity/User";
import { LibraryOwnStatus } from "../entity/LibraryOwnStatus";
import { Library } from "../entity/Library";
import { getLibraryStatus } from "../lib/library";

const MESSAGE_404 = { message: "찾을 수 없는 요소입니다." };
const MESSAGE_401 = { message: "권한이 없습니다." };

export type ReportIdRequestHandler = RequestHandler<
  any,
  any,
  any,
  { reportId: string }
>;

export const updateReportTitle: ReportIdRequestHandler = async (
  req,
  res,
  next
) => {
  const { reportId } = req.query;
  const { title } = req.body;
  const currentUser = req.user as User;
  const reportRepository = getRepository(Report);
  const findReport = await reportRepository.findOne(reportId, {
    relations: ["user"],
  });

  if (!findReport) return res.status(404).send(MESSAGE_404);

  if (findReport.user.id !== currentUser.id) {
    return res.status(401).send(MESSAGE_401);
  }

  findReport.title = title;
  await reportRepository.save(findReport);

  delete findReport.user;
  return res.status(200).send(findReport);
};

export const removeReport: ReportIdRequestHandler = async (req, res, next) => {
  const { reportId } = req.query;
  const currentUser = req.user as User;
  const reportRepository = getRepository(Report);
  const findReport = await reportRepository.findOne(reportId, {
    relations: ["user"],
  });

  if (!findReport) return res.status(404).send(MESSAGE_404);

  if (findReport.user.id !== currentUser.id) {
    return res.status(401).send(MESSAGE_401);
  }

  await reportRepository.remove(findReport);

  return res.status(200).send({ id: Number(reportId) });
};

export const findReportById: ReportIdRequestHandler = async (
  req,
  res,
  next
) => {
  const { reportId } = req.query;
  const reportRepository = getRepository(Report);
  const currentUser = req.user as User;
  const findReport = await reportRepository.findOne(reportId, {
    relations: ["user", "fragments", "book", "book.author"],
  });

  if (!findReport) {
    return res.status(404).send(MESSAGE_404);
  }

  if (findReport.user.id !== currentUser.id) {
    return res.status(401).send(MESSAGE_401);
  }

  delete findReport.user;

  return res.status(200).send(findReport);
};

export const findMyReports: RequestHandler = async (req, res, next) => {
  const currentUser = req.user as User;
  const reportRepository = getRepository(Report);
  let reports = await reportRepository.find({
    where: { user: currentUser },
    relations: ["book", "book.author"],
  });

  return res.status(200).send(reports);
};

export const findMyReportsWithLibrary: RequestHandler = async (
  req,
  res,
  next
) => {
  const currentUser = req.user as User;
  const reportRepository = getRepository(Report);
  // 1. 내가 가진 리포트를 모두 찾는다.
  let reports = await reportRepository.find({
    where: { user: currentUser },
    relations: ["book", "book.author"],
  });
  // 2. 장서 소장 / 대출 여부를 최신화 시킨다.
  await updateCollectionStatus(reports, ["146018"]);

  // 3. 다시 쿼리 후 전송
  reports = await reportRepository.find({
    where: { user: currentUser },
    relations: [
      "book",
      "book.author",
      "book.libraryOwnStatuses",
      "book.libraryOwnStatuses.library",
    ],
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
    relations: ["book", "book.libraryOwnStatuses"],
  });

  if (!report) {
    report = new Report();
    report.title = title;
    report.user = currentUser;
    report.book = book;

    // 프론트 쪽에서 아래 데이터가 와야하는데 안해주면 없어서 오류 발생 가능. 모양 맞춰주기용.
    // report.book.libraryOwnStatuses = [];

    // 존재하지 않는 리포트인 경우에만 마지막에 각 객체들 DB에 반영?
    await authorRepository.save(author);
    await bookRepository.save(book);
    await reportRepository.save(report);

    // 보낼 객체 정보에서 user 정보는 필요없으니 제외.
    delete report.user;

    return res.status(201).send(report);
  }

  return res.status(409).send({ message: "이미 존재하는 리포트입니다." });
};

async function updateCollectionStatus(reports: Report[], libCodes: string[]) {
  const libraryOwnStatusRepository = getRepository(LibraryOwnStatus);
  const libraryRepository = getRepository(Library);
  const requestTime = new Date().getTime();

  const promises = reports.map(async (report) => {
    const isbn13 = report.book.isbn.split(" ")[1];

    // 2. 가진 리포트들 중, 원하는 도서관의 상태를 확인한다.
    for (let libCode of libCodes) {
      const library = await libraryRepository.findOne({
        where: {
          code: libCode,
        },
      });
      let status = await libraryOwnStatusRepository.findOne({
        where: {
          book: report.book,
          library,
        },
      });

      if (status) {
        const updateTime = new Date(status.updatedAt).getTime();
        // 요청 시간과 최근 업데이트된 시간의 차이가 하루가 지났으면 업데이트.
        if (requestTime - updateTime > 86400000) {
          const { hasBook, loanAvailable } = await getLibraryStatus(
            libCode,
            isbn13
          );
          status.hasBook = hasBook === "Y";
          status.loanAvailable = loanAvailable === "Y";
          await libraryOwnStatusRepository.save(status);
        }
      } else {
        // 그렇지 않다면 생성
        const { hasBook, loanAvailable } = await getLibraryStatus(
          libCode,
          isbn13
        );
        const status = new LibraryOwnStatus();
        status.book = report.book;
        status.library = await libraryRepository.findOne(1);
        status.hasBook = hasBook === "Y";
        status.loanAvailable = loanAvailable === "Y";

        await libraryOwnStatusRepository.save(status);
      }
    }
  });
  await Promise.all(promises);
}
