import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { UserService } from '@/services/user.service';
import { PlaceFeedbackDto } from '../dto/user/place-feedback.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserPublicController {
  constructor(private readonly userService: UserService) {}

  @Post('place-feedback')
  async placeFeedback(@Req() req: { user?: { id?: string } }, @Body() body: PlaceFeedbackDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.userService.applyPlaceFeedback(userId, body.placeId, body.liked);
  }

  @Post('reset-vector')
  async resetVector(@Req() req: { user?: { id?: string } }) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    return this.userService.resetUserVector(userId);
  }
}
