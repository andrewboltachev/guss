import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
// eslint-disable-next-line import/no-cycle
import { UserRounds } from './userrounds.model';

@Table({
  tableName: 'rounds',
})
export class Round extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @BelongsToMany(() => User, () => UserRounds)
  users: User[];
}
