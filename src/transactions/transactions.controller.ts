import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  createTransaction(
    @Body() dto: CreateTransactionDto,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.transactionsService.createTransaction(dto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findMyTransactions(@Req() req: Request & { user: { userId: string } }) {
    return this.transactionsService.findByUser(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('summary')
  getSummary(@Req() req: Request & { user: { userId: string } }) {
    return this.transactionsService.getSummary(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string } },
  ) {
    return this.transactionsService.findOne(id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
