import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from './models/district.model';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District)
    private readonly districtRepo: typeof District,
    // private readonly jwtService: JwtService,
  ) {}
  async createDistrict(createDistrictDto: CreateDistrictDto) {
    try {
      return this.districtRepo.create(createDistrictDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllDistricts() {
    try {
      return this.districtRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findDistrictById(id: number) {
    try {
      const user = await this.districtRepo.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateDistrict(id: number, updateDistrictDto: UpdateDistrictDto) {
    try {
      const [numberOfAffectedRows, [updateDistrict]] =
        await this.districtRepo.update(updateDistrictDto, {
          where: { id },
          returning: true,
        });
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`District with ID ${id} not found`);
      }
      return updateDistrict;
    } catch (error) {
      throw error;
    }
  }

  async removeDistrict(id: number) {
    try {
      const deletedDistrict = this.districtRepo.destroy({ where: { id } });
      return deletedDistrict;
    } catch (error) {
      throw error;
    }
  }
}
