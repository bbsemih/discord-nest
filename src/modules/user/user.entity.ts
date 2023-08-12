import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Guild } from '../guild/guild.entity';

@Table({
  underscored: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Guild)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  guildId: string;

  @BelongsTo(() => Guild)
  guild: Guild;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'member',
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'joined',
  })
  status: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isBot: boolean;
}
