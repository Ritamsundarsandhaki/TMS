import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../../common/entities/task.entity';
import { TaskStatus } from '../../common/enums/enums';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  // ================= DASHBOARD STATS =================
  async getDashboardData(userId: number) {
    const tasks = await this.taskRepo.find({
      where: { user: { id: userId } },
    });

    const total = tasks.length;

    const pending = tasks.filter(
      (t) => t.status === TaskStatus.PENDING,
    ).length;

    const inProgress = tasks.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS,
    ).length;

    const completed = tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED,
    ).length;

    // ================= PROGRESS CALCULATION =================
    const progress =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    // ================= RECENT PENDING TASKS =================
    const pendingTasks = tasks
      .filter((t) => t.status === TaskStatus.PENDING)
      .slice(0, 5);

    return {
      summary: {
        total,
        pending,
        inProgress,
        completed,
        progress,
      },
      pendingTasks,
    };
  }

  // OPTIONAL PLACEHOLDERS (you can remove later)
  create() {
    return 'Not used';
  }

  findAll() {
    return 'Not used';
  }

  findOne(id: number) {
    return `Not used ${id}`;
  }

  update(id: number) {
    return `Not used ${id}`;
  }

  remove(id: number) {
    return `Not used ${id}`;
  }
}