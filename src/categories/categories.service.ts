import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto, userId: string) {
    const { name, type } = dto;

    const exist = await this.categoryModel.findOne({
      name,
      type,
      userId,
    });

    if (exist) {
      throw new ConflictException('Category đã tồn tại');
    }

    return this.categoryModel.create({
      ...dto,
      userId,
    });
  }

  async findAll(userId: string) {
    return this.categoryModel.find({ userId });
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Không tìm thấy category');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
