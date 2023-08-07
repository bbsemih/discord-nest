import { User } from '../user/user.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table
export class Message extends Model<Message> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  // one-to-one
  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  guildID: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isBot: false;
}
