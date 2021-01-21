import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.wishes, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne((type) => Book, (book) => book.wishes, { onDelete: "CASCADE" })
  book: Book;
}
