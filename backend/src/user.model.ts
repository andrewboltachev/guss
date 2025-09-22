import { Column, Model, Table } from 'sequelize-typescript';
import { Round } from './round.model';

@Table
export class User extends Model {
  @PrimaryKey
  @Column
  username: string;

  @Column
  password: string;

  @BelongsToMany(() => Round, () => UserRounds)
  rounds: Round[];
}
