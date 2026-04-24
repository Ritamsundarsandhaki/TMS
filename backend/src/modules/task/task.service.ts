import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../common/entities/task.entity';
import { User } from '../../common/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //  CREATE TASK
  async create(createTaskDto: CreateTaskDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const task = this.taskRepository.create({
      ...createTaskDto,
      user:{id:user?.id}
    });

    return await this.taskRepository.save(task);
  }

  // GET ALL TASKS (User-specific + Pagination + Filter)
  async findAll(
    userId: number,
    page = 1,
    limit = 10,
    status?: string,
  ) {
    const query = this.taskRepository.createQueryBuilder('task')
      .where('task.user.id = :userId', { userId });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    query
      .orderBy('task.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      total,
      page,
      limit,
      data,
    };
  }

  // GET SINGLE TASK
  async findOne(id: number, userId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id:id,
        user:{
          id:userId
        }
      },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // UPDATE TASK
  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.findOne(id, userId);

    Object.assign(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  //  DELETE TASK (Soft delete)
  async remove(id: number, userId: number) {
    const task = await this.findOne(id, userId);

    await this.taskRepository.softRemove(task);

    return { message: 'Task deleted successfully' };
  }
}