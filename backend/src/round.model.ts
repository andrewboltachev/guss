import { Column, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Round extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @BelongsToMany(() => User, () => UserRounds)
  users: User[];
}
