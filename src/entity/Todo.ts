import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("text")
  text: string;

  @Column({ default: false })
  done: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
