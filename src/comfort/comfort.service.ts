import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComfortDto } from './dto/create-comfort.dto';
import { UpdateComfortDto } from './dto/update-comfort.dto';
import { Comfort } from './models/comfort.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ComfortService {
  constructor(
    @InjectModel(Comfort)
    private readonly comfortRepo: typeof Comfort,
    // private readonly jwtService: JwtService,
  ) {}
  async createComfort(createComfortDto: CreateComfortDto) {
    try {
      return this.comfortRepo.create(createComfortDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllComforts() {
    try {
      return this.comfortRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findComfortById(id: number) {
    try {
      const user = await this.comfortRepo.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateComfort(id: number, updateComfortDto: UpdateComfortDto) {
    try {
      const [numberOfAffectedRows, [updateComfort]] = await this.comfortRepo.update(
        updateComfortDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`Comfort with ID ${id} not found`);
      }
      return updateComfort;
    } catch (error) {
      throw error;
    }
  }

  async removeComfort(id: number) {
    try {
      const deletedComfort = this.comfortRepo.destroy({ where: { id } });
      return deletedComfort;
    } catch (error) {
      throw error;
    }
  }
}
