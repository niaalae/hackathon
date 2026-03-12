import { Body, Controller, Post } from '@nestjs/common';
import { HeroAgentService } from '@/services/hero-agent.service';
import { ChatService } from '@/services/chat.service';
import { HeroAgentDto } from '../dto/agent/hero-agent.dto';
import { ChatDto } from '../dto/agent/chat.dto';

@Controller('agent')
export class AgentPublicController {
  constructor(
    private readonly heroAgentService: HeroAgentService,
    private readonly chatService: ChatService,
  ) { }

  @Post('hero')
  async hero(@Body() body: HeroAgentDto) {
    return this.heroAgentService.generateHeroReply(body.prompt);
  }

  @Post('chat')
  async chat(@Body() body: ChatDto) {
    const reply = await this.chatService.chat(body.message, body.history ?? []);
    return { reply };
  }
}
