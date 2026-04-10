import { Module } from '@nestjs/common';
import { AiChatbotService } from './ai_chatbot.service';
import { AiChatbotController } from './ai_chatbot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [AiChatbotController],
  providers: [AiChatbotService],
})
export class AiChatbotModule {}
