import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../common/entities/task.entity';
import { User } from '../../common/entities/user.entity';
import { TaskStatus } from 'src/common/enums/enums';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ================= CREATE TASK =================
  async create(createTaskDto: CreateTaskDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      user: { id: user.id },
    });

    const saved = await this.taskRepository.save(task);

    return { data: saved };
  }

  async findAll(
    userId: number,
    page = 1,
    limit = 10,
    status?: string,
    search?: string,
  ) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .where('user.id = :userId', { userId });

    // ================= STATUS FILTER =================
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    // ================= SEARCH FILTER =================
    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // ================= PAGINATION =================
    const skip = (page - 1) * limit;

    query.orderBy('task.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  }

  async markAsCompleted(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.status = TaskStatus.COMPLETED;

    const updated = await this.taskRepository.save(task);

    return {
      message: 'Task marked as completed successfully',
      data: updated,
    };
  }
  // ================= GET SINGLE TASK =================
  async findOne(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return { data: task };
  }

  // ================= UPDATE TASK =================
  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);

    const updated = await this.taskRepository.save(task);

    return { data: updated };
  }

  // ================= DELETE TASK =================
  async remove(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.softRemove(task);

    return { message: 'Task deleted successfully' };
  }
}
