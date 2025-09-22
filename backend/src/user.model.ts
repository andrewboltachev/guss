import { BelongsToMany, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Round } from './round.model';
// eslint-disable-next-line import/no-cycle
import { UserRounds } from './userrounds.model';

@Table({
    tableName: 'users',
})
export class User extends Model {
  @PrimaryKey
  @Column
  username: string;

  @Column
  password: string;

  @BelongsToMany(() => Round, () => UserRounds)
  rounds: Round[];
}
