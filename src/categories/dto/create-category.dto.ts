import { IsEnum, IsString } from 'class-validator';
import { TransactionType } from 'src/common/enums/transaction-type.enum';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(TransactionType)
  type: TransactionType;
}
