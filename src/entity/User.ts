import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

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
}
