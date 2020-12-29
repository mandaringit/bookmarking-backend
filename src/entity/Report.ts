import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";
import { Fragment } from "./Fragment";
import { User } from "./User";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToMany((type) => Fragment, (fragment) => fragment.report)
  fragments: Fragment[];

  @ManyToOne((type) => User, (user) => user.reports)
  user: User;

  @ManyToOne((type) => Book, (book) => book.reports)
  book: Book;
}
