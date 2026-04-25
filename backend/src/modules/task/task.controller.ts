import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * CREATE TASK
   */
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    const userId = req?.user?.sub;
    return this.taskService.create(createTaskDto, userId);
  }

  /**
   * GET ALL TASKS
   */
  @Get()
  @ApiOperation({ summary: 'Get all tasks (with pagination & filter)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  @ApiResponse({ status: 200, description: 'Tasks fetched successfully' })
  findAll(
    @Req() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const userId = req?.user?.sub;

    return this.taskService.findAll(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      status,
      search,
    );
  }

  /**
   * GET SINGLE TASK
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get single task by ID' })
  @ApiResponse({ status: 200, description: 'Task fetched successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req?.user?.sub;
    return this.taskService.findOne(Number(id), userId);
  }

  /**
   * UPDATE TASK
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    const userId = req?.user?.sub;
    return this.taskService.update(Number(id), updateTaskDto, userId);
  }

  @Patch(':id/complete')
  markAsCompleted(@Param('id') id: number, @Req() req: any) {
    return this.taskService.markAsCompleted(id, req.user.id);
  }

  /**
   * DELETE TASK
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (soft delete)' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  remove(@Param('id') id: string, @Req() req) {
    const userId = req?.user?.sub;
    return this.taskService.remove(Number(id), userId);
  }
}
