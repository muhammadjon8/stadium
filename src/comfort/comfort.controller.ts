import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComfortService } from './comfort.service';
import { CreateComfortDto } from './dto/create-comfort.dto';
import { UpdateComfortDto } from './dto/update-comfort.dto';

@Controller('comfort')
export class ComfortController {
  constructor(private readonly comfortService: ComfortService) {}

  @Post()
  create(@Body() createComfortDto: CreateComfortDto) {
    return this.comfortService.createComfort(createComfortDto);
  }

  @Get()
  findAll() {
    return this.comfortService.findAllComforts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comfortService.findComfortById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComfortDto: UpdateComfortDto) {
    return this.comfortService.updateComfort(+id, updateComfortDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comfortService.removeComfort(+id);
  }
}
