import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';


interface IComfortStadiumCreationAttr {
  comfort_id: number;
  stadium_id: number;
}

@Table({ tableName: 'comfort_stadium' })
export class ComfortStadium extends Model<
  ComfortStadium,
  IComfortStadiumCreationAttr
> {
    @ApiProperty({ example: 1, description: 'Comfort Stadium ID' })
    @Column({
      primaryKey: true,
      autoIncrement: true,
      type: DataType.INTEGER,
    })
    id: number;

    @ApiProperty({ example: 1, description: 'Comfort ID' })
    @Column({
      type: DataType.INTEGER,
    })
    comfort_id: number;

    @ApiProperty({ example: 1, description: 'Stadium ID' })
    @Column({
      type: DataType.INTEGER,
    })
    stadium_id: number;
}
