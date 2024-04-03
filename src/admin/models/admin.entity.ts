import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IAdminCreationAttr {
  login: string;
  tg_link: string;
  admin_photo: string;
  hashed_password: string;
  is_active: boolean;
  is_creator: boolean;
  hashed_refresh_token: string;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, IAdminCreationAttr> {
  @ApiProperty({ example: 1, description: 'Admin ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({ example: 'Ali Valiyev', description: "Admin's full name" })
  @Column({
    type: DataType.STRING,
  })
  login: string;

  @ApiProperty({
    example: 't.me/alivaliyev',
    description: "Admin's telegram username",
  })
  @Column({
    type: DataType.STRING,
  })
  tg_link: string;

  @ApiProperty({ example: 'image.png', description: "Admin's photo" })
  @Column({
    type: DataType.STRING,
  })
  admin_photo: string;

  @ApiProperty({ example: '123456', description: "Admin's password" })
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @ApiProperty({ example: true, description: "Admin's is_active" })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({ example: true, description: "Admin's is_creator" })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_creator: boolean;

  @ApiProperty({
    example: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    description: "Admin's hashed refresh token",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;
}
