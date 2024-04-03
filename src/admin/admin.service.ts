import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { Response } from 'express';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin)
    private readonly adminRepo: typeof Admin,
    private readonly jwtService: JwtService,
  ) {}
  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      is_active: admin.is_active,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  async registration(createAdminDto: CreateAdminDto, res: Response) {
    const admin = await this.adminRepo.findOne({
      where: { login: createAdminDto.login },
    });
    if (admin) {
      throw new BadRequestException('Admin already registered');
    }

    const hashed_password = await bcrypt.hash(
      createAdminDto.hashed_password,
      7,
    );
    const newAdmin = await this.adminRepo.create({
      ...createAdminDto,
      hashed_password,
    });
    const tokens = await this.getTokens(newAdmin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    const updatedAdmin = await this.adminRepo.update(
      { hashed_refresh_token },
      { where: { id: newAdmin.id }, returning: true },
    );
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'Registration successful',
      admin: updatedAdmin[1][0],
      tokens,
    };
    return response;
  }

  async findAllAdmins() {
    try {
      return this.adminRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findAdminById(id: number) {
    try {
      const admin = await this.adminRepo.findByPk(id);
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const [numberOfAffectedRows, [updateAdmin]] = await this.adminRepo.update(
        updateAdminDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }
      return updateAdmin;
    } catch (error) {
      throw error;
    }
  }

  async removeAdmin(id: number) {
    try {
      const deletedAdmin = this.adminRepo.destroy({ where: { id } });
      return deletedAdmin;
    } catch (error) {
      throw error;
    }
  }
  async login(loginadminDto: LoginAdminDto, res: Response) {
    const { name, password } = loginadminDto;
    const admin = await this.adminRepo.findOne({ where: { login: name } });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    if (!admin.is_active) {
      throw new BadRequestException('Admin is not activated');
    }
    const isMatch = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatch) {
      throw new BadRequestException('Passwords do not match');
    }
    const tokens = await this.getTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    const updatedAdmin = await this.adminRepo.update(
      { hashed_refresh_token },
      { where: { id: admin.id }, returning: true },
    );
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'Admin logged in successfully',
      admin: updatedAdmin[1][0],
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!adminData) {
      throw new BadRequestException('Admin not verified');
    }
    const updateAdmin = await this.adminRepo.update(
      {
        hashed_refresh_token: null,
      },
      {
        where: {
          id: adminData.id,
        },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'Admin logged out successfully',
      admin_refreshToken: updateAdmin[1][0].hashed_refresh_token,
    };
    return response;
  }
  
  async refreshToken(adminId: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);
    if (adminId !== decodedToken['id']) {
      throw new BadRequestException('Admin not verified');
    }
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin || !admin.hashed_refresh_token) {
      throw new BadRequestException('Admin not found');
    }
    const isMatch = await bcrypt.compare(
      refreshToken,
      admin.hashed_refresh_token,
    );
    if (!isMatch) {
      throw new ForbiddenException('Admin not verified');
    }
    const tokens = await this.getTokens(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    const updatedAdmin = await this.adminRepo.update(
      { hashed_refresh_token },
      { where: { id: admin.id }, returning: true },
    );
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'admin get new refresh token',
      admin: updatedAdmin[1][0],
      tokens,
    };
    return response;
  }
}
