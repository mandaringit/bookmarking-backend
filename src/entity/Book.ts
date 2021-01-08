import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Author } from "./Author";
import { Report } from "./Report";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: string;

  @Index({ unique: true })
  @Column()
  isbn: string;

  @Column()
  title: string;

  @Column()
  thumbnail: string;

  @ManyToOne((type) => Author, (author) => author.books, {
    onDelete: "CASCADE",
  })
  author: Author;

  @OneToMany((type) => Report, (report) => report.book, { cascade: true })
  reports: Report[];
}
