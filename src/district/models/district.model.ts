import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IDitrictCreationAttr {
  name: string;
  region_id: number;
}

@Table({ tableName: 'district' })
export class District extends Model<District, IDitrictCreationAttr> {
  @ApiProperty({ example: 1, description: 'District ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({ example: 'Pastdargom', description: 'District name' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({ example: 1, description: 'District region ID' })
  @Column({
    type: DataType.INTEGER,
  })
  region_id: number;
}
