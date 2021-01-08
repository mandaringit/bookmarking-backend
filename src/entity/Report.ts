import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./Book";
import { Fragment } from "./Fragment";
import { User } from "./User";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("text")
  title: string;

  @ManyToOne((type) => User, (user) => user.reports, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne((type) => Book, (book) => book.reports, { onDelete: "CASCADE" })
  book: Book;

  @OneToMany((type) => Fragment, (fragment) => fragment.report, {
    cascade: true,
  })
  fragments: Fragment[];
}
