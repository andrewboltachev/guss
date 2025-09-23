import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { User } from './user.model';
import { Round } from './round.model';

@Table({
  tableName: 'user_rounds',
  timestamps: false,
})
export class UserRounds extends Model {
  @ForeignKey(() => User)
  @Column({
    unique: 'uniqueForUserAndRound',
  })
  declare username: string;

  @ForeignKey(() => Round)
  @Column({
    unique: 'uniqueForUserAndRound',
  })
  declare roundId: string;

  // число попаданий (нажатий)
  @Column({
    defaultValue: 0,
  })
  declare hits: number;

  // число очков =
  // число попаданий + 9 экстра на каждый 11й
  @Column({
    defaultValue: 0,
  })
  declare score: number;
}
