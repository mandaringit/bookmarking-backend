import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Book } from "./Book";
import { Library } from "./Library";

/**
 * 도서관이 책을 가지고 있는지, 또는 대출 가능한지 여부에 대한 상태.
 */
@Entity()
export class LibraryOwnStatus {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => Book, (book) => book.libraryOwnStatuses, {
    onDelete: "CASCADE",
  })
  book: Book;

  @ManyToOne((type) => Library, (Library) => Library.libraryOwnStatuses, {
    onDelete: "CASCADE",
  })
  library: Library;

  @Column()
  hasBook: boolean;

  @Column()
  loanAvailable: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
