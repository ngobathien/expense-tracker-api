import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '../common/enums/transaction-type.enum';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schemas/category.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,

    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  // tạo giao dịch mới
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ) {
    const { categoryId, type } = createTransactionDto;

    const category = await this.categoryModel.findById({
      _id: categoryId,
      userId,
    });
    console.log(category);

    if (!category) {
      throw new NotFoundException('Category không tồn tại');
    }

    if (category?.type !== type) {
      throw new BadRequestException(
        'Transaction type phải giống category type',
      );
    }

    return this.transactionModel.create({
      ...createTransactionDto,
      categoryType: category.type,
      userId,
    });
  }

  async findAll() {
    return this.transactionModel.find();
  }

  async findByUser(userId: string) {
    return this.transactionModel
      .find({ userId })
      .populate('categoryId', 'name type')
      .sort({ date: -1 });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionModel
      .findOne({
        _id: id,
        userId,
      })
      .populate('categoryId', 'name type');

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const transaction = await this.transactionModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async remove(id: string) {
    const transaction = await this.transactionModel.findByIdAndDelete(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return { message: 'Deleted successfully' };
  }
}
