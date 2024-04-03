import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Response } from 'express';
import { Cookiegetter } from '../decorators/cookie_getter.decorator';
import { AdminGuard } from '../guards/admin.guard';
import { SelfAdminGuard } from '../guards/self.admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  registration(
    @Body() createAdminDto: CreateAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.registration(createAdminDto, res);
  }

  @HttpCode(200)
  @Post('login')
  login(
    @Body() loginUserDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(loginUserDto, res);
  }
  @UseGuards(AdminGuard)
  @HttpCode(200)
  @Post('logout')
  logout(
    @Cookiegetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.logout(refreshToken, res);
  }

  @HttpCode(200)
  @Post(':id/refresh')
  refresh(
    @Param('id') id: number,
    @Cookiegetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.refreshToken(+id, refreshToken, res);
  }

  @Get()
  findAll() {
    return this.adminService.findAllAdmins();
  }
  @UseGuards(SelfAdminGuard)
  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findAdminById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdmin(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.removeAdmin(+id);
  }
}
