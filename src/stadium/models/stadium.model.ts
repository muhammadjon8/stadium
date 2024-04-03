import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IStadiumCreationAttr {
  categrory_id: number;
  owner_id: number;
  contact_with: string;
  name: string;
  volume: string;
  address: string;
  region_id: number;
  district_id: number;
  location: string;
  buildAt: Date;
  start_time: Date;
  end_time: Date;
}

@Table({ tableName: 'stadium' })
export class Stadium extends Model<Stadium, IStadiumCreationAttr> {
  @ApiProperty({ example: 1, description: 'Stadium ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({ example: 1, description: 'Category parent ID' })
  @Column({
    type: DataType.INTEGER,
  })
  category_id: number;

  @ApiProperty({ example: 1, description: 'Owner ID' })
  @Column({
    type: DataType.INTEGER,
  })
  owner_id: number;

  @ApiProperty({ example: 'Marat', description: 'Contact with' })
  @Column({
    type: DataType.STRING,
  })
  contact_with: string;

  @ApiProperty({ example: 'Stadium 1', description: 'Stadium name' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({ example: 1, description: 'Stadium volume' })
  @Column({
    type: DataType.STRING,
  })
  volume: string;

  @ApiProperty({ example: 'Stadium address', description: 'Stadium address' })
  @Column({
    type: DataType.STRING,
  })
  address: string;

  @ApiProperty({ example: 1, description: 'Stadium region ID' })
  @Column({
    type: DataType.INTEGER,
  })
  region_id: number;

  @ApiProperty({ example: 1, description: 'Stadium district ID' })
  @Column({
    type: DataType.INTEGER,
  })
  district_id: number;

  @ApiProperty({ example: 'Stadium location', description: 'Stadium location' })
  @Column({
    type: DataType.STRING,
  })
  location: string;

  @ApiProperty({ example: 'Stadium buildAt', description: 'Stadium buildAt' })
  @Column({
    type: DataType.DATE,
  })
  buildAt: Date;

  @ApiProperty({
    example: 'Stadium start_time',
    description: 'Stadium start_time',
  })
  @Column({
    type: DataType.DATE,
  })
  start_time: Date;

  @ApiProperty({ example: 'Stadium end_time', description: 'Stadium end_time' })
  @Column({
    type: DataType.DATE,
  })
  end_time: Date;
}
