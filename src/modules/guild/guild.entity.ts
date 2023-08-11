import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../user/user.entity';

@Table
export class Guild extends Model<Guild> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ownerId!: string;

  @BelongsTo(() => User)
  owner: User;

  @HasMany(() => User)
  members!: User[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  memberCount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  icon!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  roles: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  region: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  })
  nsfwLevel: number;
}
