import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Author {
  @PrimaryGeneratedColumn({})
  id: string;

  @Column()
  name: string;

  @OneToMany((type) => Book, (book) => book.author, { cascade: true })
  books: Book[];
}
