import {
  IsNumber,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

import { TransactionType } from '../../common/enums/transaction-type.enum';

export class CreateTransactionDto {
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
