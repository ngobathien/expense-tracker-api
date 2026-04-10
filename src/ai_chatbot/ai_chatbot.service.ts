import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import {
  Transaction,
  TransactionDocument,
} from 'src/transactions/schemas/transaction.schema';

@Injectable()
export class AiChatbotService {
  private ai: GoogleGenAI;

  constructor(
    private configService: ConfigService,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async chat(message: string, userId: string) {
    if (!userId) {
      return 'Thiếu userId';
    }
    try {
      // Lấy giao dịch của user (giới hạn 20 cái cho nhẹ)
      const transactions = await this.transactionModel
        .find({ userId })
        .sort({ date: -1 })
        .limit(20);

      if (!transactions.length) {
        return 'Bạn chưa có giao dịch nào';
      }

      // Convert data thành text
      const context = transactions
        .map(
          (t) =>
            `Tên: ${t.name}, Tiền: ${t.amount}, Loại: ${t.type}, Ngày: ${t.date.toISOString().split('T')[0]}`,
        )
        .join('\n');

      const prompt = `
Bạn là chatbot quản lý chi tiêu cá nhân.

Dữ liệu giao dịch:
${context}

Quy tắc:
- Chỉ trả lời dựa trên dữ liệu
- Không bịa
- Trả lời ngắn gọn, dễ hiểu
- Không dùng markdown

Câu hỏi: ${message}
`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const text =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        'AI không trả lời';

      return {
        reply: text,
      };
      // return response.text;
    } catch (error) {
      console.error(error);
      return 'Lỗi hệ thống';
    }
  }
}
