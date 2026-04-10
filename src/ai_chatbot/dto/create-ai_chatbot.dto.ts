import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAiChatbotDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  userId: string;
}
