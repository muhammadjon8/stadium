import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from './models/region.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region)
    private readonly regionRepo: typeof Region,
    // private readonly jwtService: JwtService,
  ) {}
  async createRegion(createRegionDto: CreateRegionDto) {
    try {
      return this.regionRepo.create(createRegionDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllRegions() {
    try {
      return this.regionRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findRegionById(id: number) {
    try {
      const user = await this.regionRepo.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateRegion(id: number, updateRegionDto: UpdateRegionDto) {
    try {
      const [numberOfAffectedRows, [updateRegion]] =
        await this.regionRepo.update(updateRegionDto, {
          where: { id },
          returning: true,
        });
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`Region with ID ${id} not found`);
      }
      return updateRegion;
    } catch (error) {
      throw error;
    }
  }

  async removeRegion(id: number) {
    try {
      const deletedRegion = this.regionRepo.destroy({ where: { id } });
      return deletedRegion;
    } catch (error) {
      throw error;
    }
  }
}
