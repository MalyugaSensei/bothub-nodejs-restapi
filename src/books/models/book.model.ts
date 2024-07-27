import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
})
export class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

  @Column
  author: string;

  @Column({ type: DataType.DATE })
  publicationDate: Date;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  genres: string[];
}
