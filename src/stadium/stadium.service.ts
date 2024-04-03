import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStadiumDto } from './dto/create-stadium.dto';
import { UpdateStadiumDto } from './dto/update-stadium.dto';
import { Stadium } from './models/stadium.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class StadiumService {
  constructor(
    @InjectModel(Stadium)
    private readonly stadiumRepo: typeof Stadium,
    // private readonly jwtService: JwtService,
  ) {}
  async createStadium(createStadiumDto: CreateStadiumDto) {
    try {
      return this.stadiumRepo.create(createStadiumDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllStadiums() {
    try {
      return this.stadiumRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findStadiumById(id: number) {
    try {
      const user = await this.stadiumRepo.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateStadium(id: number, updateStadiumDto: UpdateStadiumDto) {
    try {
      const [numberOfAffectedRows, [updateStadium]] =
        await this.stadiumRepo.update(updateStadiumDto, {
          where: { id },
          returning: true,
        });
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`Stadium with ID ${id} not found`);
      }
      return updateStadium;
    } catch (error) {
      throw error;
    }
  }

  async removeStadium(id: number) {
    try {
      const deletedStadium = this.stadiumRepo.destroy({ where: { id } });
      return deletedStadium;
    } catch (error) {
      throw error;
    }
  }
}
