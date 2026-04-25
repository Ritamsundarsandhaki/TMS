import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { TaskStatus, TaskPriority } from '../enums/enums';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 200 })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // ✅ Use Enum for Status
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  // ✅ Use Enum for Priority
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  // Progress
  @Column({ type: 'int', default: 0 })
  progress: number;

  // Due Date
  @Column({ type: 'timestamp', nullable: true })
  @Index()
  dueDate: Date;

  //  Relation
  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
  })
  user: User;

  //  Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 🗑️ Soft Delete
  @DeleteDateColumn()
  deletedAt: Date;
}