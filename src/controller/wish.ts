import { RequestHandler } from "express";
import { getRepository } from "typeorm";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { User } from "../entity/User";
import { LibraryOwnStatus } from "../entity/LibraryOwnStatus";
import { Library } from "../entity/Library";
import { getLibraryStatus } from "../lib/library";
import { Wish } from "../entity/Wish";

export const findMyWishes: RequestHandler = async (req, res, next) => {
  const currentUser = req.user as User;
  const wishRepository = getRepository(Wish);
  let wishes = await wishRepository.find({
    where: { user: currentUser },
    relations: ["book", "book.author"],
  });

  return res.status(200).send(wishes);
};

export const findMyWishesWithLibrary: RequestHandler = async (
  req,
  res,
  next
) => {
  const currentUser = req.user as User;
  const wishRepository = getRepository(Wish);
  // 1. 내가 가진 위시를 모두 찾는다.
  let wishes = await wishRepository.find({
    where: { user: currentUser },
    relations: ["book", "book.author"],
  });
  // 2. 장서 소장 / 대출 여부를 최신화 시킨다.
  await updateCollectionStatus(wishes, ["146018"]);

  // 3. 다시 쿼리 후 전송
  wishes = await wishRepository.find({
    where: { user: currentUser },
    relations: [
      "book",
      "book.author",
      "book.libraryOwnStatuses",
      "book.libraryOwnStatuses.library",
    ],
  });

  return res.status(200).send(wishes);
};

export const removeWish: RequestHandler<
  any,
  any,
  any,
  { wishId: string }
> = async (req, res, next) => {
  const { wishId } = req.query;
  const wishRepository = getRepository(Wish);
  const currentUser = req.user as User;

  const findWish = await wishRepository.findOne(wishId, {
    relations: ["book", "user"],
  });

  if (currentUser.id !== findWish.user.id) {
    return res.status(401).send({ message: "권한이 없습니다." });
  }

  if (!findWish) {
    return res.status(404).send({ message: "찾을 수 없는 찜 아이템입니다." });
  }

  const id = findWish.id;
  const isbn = findWish.book.isbn;
  await wishRepository.remove(findWish);
  return res.status(200).send({ id, book: { isbn } });
};

export const createWish: RequestHandler = async (req, res, next) => {
  const wishRepository = getRepository(Wish);
  const bookRepository = getRepository(Book);
  const currentUser = req.user as User;
  const { bookInfo } = req.body;

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
  let book = await bookRepository.findOne({ isbn: bookInfo.isbn });
  if (!book) {
    book = new Book();
    book.title = bookInfo.title;
    book.thumbnail = bookInfo.thumbnail;
    book.isbn = bookInfo.isbn;
    book.author = author; // author 객체.
  }

  // 3. Wish 만들기
  const wish = new Wish();
  wish.user = currentUser;
  wish.book = book;

  // 존재하지 않는 리포트인 경우에만 마지막에 각 객체들 DB에 반영?
  await authorRepository.save(author);
  await bookRepository.save(book);
  await wishRepository.save(wish);

  // 보낼 객체 정보에서 user 정보는 필요없으니 제외.
  delete wish.user;

  return res.status(201).send(wish);
};

async function updateCollectionStatus(wishes: Wish[], libCodes: string[]) {
  const libraryOwnStatusRepository = getRepository(LibraryOwnStatus);
  const libraryRepository = getRepository(Library);
  const requestTime = new Date().getTime();

  const promises = wishes.map(async (wish) => {
    const isbn13 = wish.book.isbn.split(" ")[1];

    // 2. 가진 리포트들 중, 원하는 도서관의 상태를 확인한다.
    for (let libCode of libCodes) {
      const library = await libraryRepository.findOne({
        where: {
          code: libCode,
        },
      });
      let status = await libraryOwnStatusRepository.findOne({
        where: {
          book: wish.book,
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
        status.book = wish.book;
        status.library = await libraryRepository.findOne(1);
        status.hasBook = hasBook === "Y";
        status.loanAvailable = loanAvailable === "Y";

        await libraryOwnStatusRepository.save(status);
      }
    }
  });
  await Promise.all(promises);
}
