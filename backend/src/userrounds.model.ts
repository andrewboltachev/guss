import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import { User } from './user.model';
import { Round } from './round.model';

@Table({
  tableName: 'user_rounds',
  timestamps: false,
})
export class UserRounds extends Model {
  @ForeignKey(() => User)
  @Column
  username: string;

  @ForeignKey(() => Round)
  @Column
  roundId: string;

  // число попаданий (нажатий)
  @Column({
    defaultValue: 0,
  })
  hits: number;

  // число очков =
  // число попаданий + 9 экстра на каждый 11й
  @Column({
    defaultValue: 0,
  })
  score: number;
}
