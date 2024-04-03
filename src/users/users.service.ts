import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { LoginUserDto } from './dto/login-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userRepo: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
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

  async registration(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException('User already registered');
    }
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userRepo.create({
      ...createUserDto,
      hashed_password,
    });
    const tokens = await this.getTokens(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    const activation_link = v4();
    const updatedUser = await this.userRepo.update(
      { hashed_refresh_token, activation_link },
      { where: { id: newUser.id }, returning: true },
    );
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    try {
      await this.mailService.sendMail(updatedUser[1][0]);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Xatni yuborishda xatolik');
    }
    const response = {
      message: 'Registration successful',
      user: updatedUser[1][0],
      tokens,
    };
    return response;
  }
  createUser(createUserDto: CreateUserDto) {
    try {
      return this.userRepo.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  findAllUsers() {
    try {
      return this.userRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findUserById(id: number) {
    try {
      const user = await this.userRepo.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUser(findUserDto: FindUserDto) {
    const where = {};
    if (findUserDto.full_name) {
      where['full_name'] = {
        [Op.iLike]: `%${findUserDto.full_name}%`,
      };
    }
    if (findUserDto.email) {
      where['email'] = {
        [Op.iLike]: `%${findUserDto.email}%`,
      };
    }
    if (findUserDto.phone) {
      where['phone'] = {
        [Op.iLike]: `%${findUserDto.phone}%`,
      };
    }
    if (findUserDto.tg_link) {
      where['tg_link'] = {
        [Op.iLike]: `%${findUserDto.tg_link}%`,
      };
    }

    console.log(where);

    const users = await this.userRepo.findAll({ where });
    if (!users) {
      throw new NotFoundException('User not found');
    }
    return users;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const [numberOfAffectedRows, [updateUser]] = await this.userRepo.update(
        updateUserDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updateUser;
    } catch (error) {
      throw error;
    }
  }

  removeUser(id: number) {
    try {
      const deletedUser = this.userRepo.destroy({ where: { id } });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link is required');
    }

    const updatedUser = await this.userRepo.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );
    if (!updatedUser[1][0]) {
      throw new BadRequestException('User already activated');
    }
    const response = {
      message: 'User activated successfully',
      user: updatedUser[1][0].is_active,
    };
  }

  async login(loginuserDto: LoginUserDto, res: Response) {
    const { email, password } = loginuserDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.is_active) {
      throw new BadRequestException('User is not activated');
    }
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      throw new BadRequestException('Passwords do not match');
    }
    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    const activation_link = v4();
    const updatedUser = await this.userRepo.update(
      { hashed_refresh_token },
      { where: { id: user.id }, returning: true },
    );
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'User logged in successfully',
      user: updatedUser[1][0],
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!userData) {
      throw new BadRequestException('User not verified');
    }
    const updateUser = await this.userRepo.update(
      {
        hashed_refresh_token: null,
      },
      {
        where: {
          id: userData.id,
        },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'User logged out successfully',
      user_refreshToken: updateUser[1][0].hashed_refresh_token,
    };
    return response;
  }
  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);
    if (userId !== decodedToken['id']) {
      throw new BadRequestException('User not verified');
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException('User not found');
    }
    const isMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!isMatch) {
      throw new ForbiddenException('User not verified');
    }
    const tokens = await this.getTokens(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refreshToken, 7);
    const updatedUser = await this.userRepo.update(
      { hashed_refresh_token },
      { where: { id: user.id }, returning: true },
    );
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'user get new refresh token',
      user: updatedUser[1][0],
      tokens,
    };
    return response;
  }
}
