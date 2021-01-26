import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Fragment } from "./Fragment";
import { Report } from "./Report";
import { Todo } from "./Todo";
import { Wish } from "./Wish";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ default: "default" })
  username: string;

  @Column("text")
  password: string;

  @Column({ default: "" })
  googleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany((type) => Todo, (todo) => todo.user, { cascade: true })
  todos: Todo[];

  @OneToMany((type) => Report, (report) => report.user, { cascade: true })
  reports: Report[];

  @OneToMany((type) => Fragment, (fragment) => fragment.user, { cascade: true })
  fragments: Fragment[];

  @OneToMany((type) => Wish, (wish) => wish.user, { cascade: true })
  wishes: Wish[];
}
