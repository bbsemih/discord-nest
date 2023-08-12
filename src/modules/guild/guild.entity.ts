import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { User } from '../user/user.entity';

@Table({
  tableName: 'guilds',
  underscored: true,
})
export class Guild extends Model<Guild> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

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
    type: DataType.UUID,
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
