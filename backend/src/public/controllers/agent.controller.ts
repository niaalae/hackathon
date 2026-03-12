import { Body, Controller, Post } from '@nestjs/common';
import { HeroAgentService } from '@/services/hero-agent.service';
import { HeroAgentDto } from '../dto/agent/hero-agent.dto';

@Controller('agent')
export class AgentPublicController {
  constructor(private readonly heroAgentService: HeroAgentService) {}

  @Post('hero')
  async hero(@Body() body: HeroAgentDto) {
    return this.heroAgentService.generateHeroReply(body.prompt);
  }
}
