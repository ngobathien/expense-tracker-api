import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.categoriesService.createCategory(
      createCategoryDto,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request & { user: { userId: string } }) {
    return this.categoriesService.findAll(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyCategories(@Req() req: Request & { user: { userId: string } }) {
    // return this.bookingsService.getMyCategories(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
