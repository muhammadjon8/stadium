import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepo: typeof Category,
    // private readonly jwtService: JwtService,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryRepo.create(createCategoryDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllCategorys() {
    try {
      return this.categoryRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findCategoryById(id: number) {
    try {
      const user = await this.categoryRepo.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const [numberOfAffectedRows, [updateCategory]] = await this.categoryRepo.update(
        updateCategoryDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return updateCategory;
    } catch (error) {
      throw error;
    }
  }

  async removeCategory(id: number) {
    try {
      const deletedCategory = this.categoryRepo.destroy({ where: { id } });
      return deletedCategory;
    } catch (error) {
      throw error;
    }
  }
}
