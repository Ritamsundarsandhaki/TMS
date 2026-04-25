import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * GET DASHBOARD DATA
   */
  @Get()
  @ApiOperation({ summary: 'Get dashboard analytics (tasks summary)' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data fetched successfully',
  })
  getDashboard(@Req() req) {
    const userId = req?.user?.sub;

    return this.dashboardService.getDashboardData(userId);
  }
}