import { Controller, Post, Body } from '@nestjs/common';
import { AiChatbotService } from './ai_chatbot.service';
import { CreateAiChatbotDto } from './dto/create-ai_chatbot.dto';

@Controller('ai-chatbot')
export class AiChatbotController {
  constructor(private readonly aiChatbotService: AiChatbotService) {}

  @Post('chat')
  async chat(@Body() body: CreateAiChatbotDto) {
    return this.aiChatbotService.chat(body.message, body.userId);
  }
}
