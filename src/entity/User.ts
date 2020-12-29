import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Fragment } from "./Fragment";
import { Report } from "./Report";
import { Todo } from "./Todo";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
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
}
