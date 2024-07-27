import { Column, Default, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
})
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  password: string;

  @Column
  email: string;

  @Column
  role: number;

  @Default(false)
  @Column
  confirmed: boolean;
}
