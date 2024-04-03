import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  login: string;
  tg_link: string;
  admin_photo: string;
  hashed_password: string;
  is_active: boolean;
  is_creator: boolean;
  hashed_refresh_token: string;
}
