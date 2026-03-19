import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(AuthGuard)
  @Get('summary')
  getSummary(@Req() req: Request & { user: { userId: string } }) {
    return this.statsService.getSummary(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('monthly')
  getMonthly(
    @Req() req: Request & { user: { userId: string } },
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.statsService.getMonthlyStats(
      req.user.userId,
      Number(month),
      Number(year),
    );
  }

  @UseGuards(AuthGuard)
  @Get('calendar')
  getCalendar(
    @Req() req: Request & { user: { userId: string } },
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.statsService.getCalendarStats(
      req.user.userId,
      Number(month),
      Number(year),
    );
  }

  @UseGuards(AuthGuard)
  @Get('category')
  getCategory(@Req() req: Request & { user: { userId: string } }) {
    return this.statsService.getCategoryStats(req.user.userId);
  }
}
