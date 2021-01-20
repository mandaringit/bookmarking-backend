import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LibraryOwnStatus } from "./LibraryOwnStatus";

@Entity()
export class Library {
  @PrimaryGeneratedColumn()
  id: string;

  @Index({ unique: true })
  @Column()
  code: string;

  @OneToMany(
    (type) => LibraryOwnStatus,
    (libraryOwnStatus) => libraryOwnStatus.library
  )
  libraryOwnStatuses: LibraryOwnStatus[];
}
