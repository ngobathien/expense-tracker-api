import { Test, TestingModule } from '@nestjs/testing';
import { AiChatbotController } from './ai_chatbot.controller';
import { AiChatbotService } from './ai_chatbot.service';

describe('AiChatbotController', () => {
  let controller: AiChatbotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiChatbotController],
      providers: [AiChatbotService],
    }).compile();

    controller = module.get<AiChatbotController>(AiChatbotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
