import { PartialType } from '@nestjs/mapped-types';
import { CreateAiChatbotDto } from './create-ai_chatbot.dto';

export class UpdateAiChatbotDto extends PartialType(CreateAiChatbotDto) {}
