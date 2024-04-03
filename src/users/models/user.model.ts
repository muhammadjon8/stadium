import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IUserCreationAttr {
  full_name: string;
  phone: string;
  email: string;
  hashed_password: string;
  tg_link: string;
  photo: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, IUserCreationAttr> {
  @ApiProperty({ example: 1, description: 'User ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;
  @ApiProperty({ example: 'Ali Valiyev', description: "User's full name" })
  @Column({
    type: DataType.STRING,
  })
  full_name: string;
  @ApiProperty({ example: '+998951234569', description: "User's phone number" })
  @Column({
    type: DataType.STRING,
  })
  phone: string;
  @ApiProperty({ example: 'ali@gmail.com', description: "User's email" })
  @Column({
    type: DataType.STRING,
  })
  email: string;

  @ApiProperty({
    example: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    description: "User's hashed password",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({
    example: 'https://t.me/ali_valiyev',
    description: "User's Telegram link",
  })
  @Column({
    type: DataType.STRING,
  })
  tg_link: string;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/stadium-images/users/default.png',
    description: "User's photo",
  })
  @Column({
    type: DataType.STRING,
  })
  photo: string;

  @ApiProperty({
    example: true,
    description: "User's is_owner flag",
  })
  @Column({
    type: DataType.BOOLEAN,
  })
  is_owner: boolean;

  @ApiProperty({
    example: true,
    description: "User's is_active flag",
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({
    example: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    description: "User's hashed refresh token",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;
  @Column({
    type: DataType.STRING,
  })
  activation_link: string;
}
