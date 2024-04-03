import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './models/media.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media)
    private readonly mediaRepo: typeof Media,
    // private readonly jwtService: JwtService,
  ) {}
  async createMedia(createMediaDto: CreateMediaDto) {
    try {
      return this.mediaRepo.create(createMediaDto);
    } catch (error) {
      throw error;
    }
  }

  async findAllMedias() {
    try {
      return this.mediaRepo.findAll({ include: { all: true } });
    } catch (err) {
      throw err;
    }
  }

  async findMediaById(id: number) {
    try {
      const user = await this.mediaRepo.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateMedia(id: number, updateMediaDto: UpdateMediaDto) {
    try {
      const [numberOfAffectedRows, [updateMedia]] = await this.mediaRepo.update(
        updateMediaDto,
        {
          where: { id },
          returning: true,
        },
      );
      if (numberOfAffectedRows === 0) {
        throw new NotFoundException(`Media with ID ${id} not found`);
      }
      return updateMedia;
    } catch (error) {
      throw error;
    }
  }

  async removeMedia(id: number) {
    try {
      const deletedMedia = this.mediaRepo.destroy({ where: { id } });
      return deletedMedia;
    } catch (error) {
      throw error;
    }
  }
}
