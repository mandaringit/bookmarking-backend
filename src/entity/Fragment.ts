import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Report } from "./Report";
import { User } from "./User";

@Entity()
export class Fragment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("text")
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => Report, (report) => report.fragments, {
    onDelete: "CASCADE",
  })
  report: Report;

  @ManyToOne((type) => User, (user) => user.fragments, { onDelete: "CASCADE" })
  user: User;
}
