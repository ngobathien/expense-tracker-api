import {
  IsNumber,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

import { TransactionType } from '../../common/enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsString()
  note?: string;
}
