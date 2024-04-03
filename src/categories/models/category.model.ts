import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ICategoryCreationAttr {
  name: string;
  parent_id: number;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, ICategoryCreationAttr> {
  @ApiProperty({ example: 1, description: 'Category ID' })
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ApiProperty({ example: 'Category 1', description: 'Category name' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({ example: 1, description: 'Category parent ID' })
  @Column({
    type: DataType.INTEGER,
  })
  parent_id: number;
}
