import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  region_id: number;
}
