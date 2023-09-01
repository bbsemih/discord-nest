import { User } from '../user/user.entity';
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Guild } from '../guild/guild.entity';

@Table({
  tableName: 'messages',
  underscored: true,
})
export class Message extends Model<Message> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'user_id',
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 's3_url',
  })
  s3Url: string;

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

  @ForeignKey(() => Guild)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  guildID: string;
}
