import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IComfortCreationAttr {
  name: string;
}
@Table({ tableName: 'comfort' })
export class Comfort extends Model<Comfort, IComfortCreationAttr> {
  @ApiProperty({ example: 1, description: 'Comfort ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({ example: 'Comfort', description: "Comfort's name" })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({ example: true, description: "Comfort's parent id" })
  @Column({
    type: DataType.BOOLEAN,
  })
  parent_id: number;
}
