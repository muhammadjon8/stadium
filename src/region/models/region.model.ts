import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IRegionCreationAttr {
  name: string;
}

@Table({ tableName: 'region' })
export class Region extends Model<Region, IRegionCreationAttr> {
  @ApiProperty({ example: 1, description: 'Region ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'Istanbul', description: "Region's name" })
  @Column({
    type: DataType.STRING,
  })
  name: string;
}
