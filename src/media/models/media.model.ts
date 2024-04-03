import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IMediaCreationAttr {
  stadium_id: number;
  photo: string;
  description: string;
}

@Table({ tableName: 'media' })
export class Media extends Model<Media, IMediaCreationAttr> {
  @ApiProperty({ example: 1, description: 'Media ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'Stadium ID' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stadium_id: number;

  @ApiProperty({ example: 'image.jpg', description: 'Media photo' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  photo: string;

  @ApiProperty({ example: 'Lorem ipsum', description: 'Media description' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
}
