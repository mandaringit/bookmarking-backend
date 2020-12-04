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

  @Column()
  done: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
