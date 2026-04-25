export const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type TaskStatus =
  (typeof TaskStatus)[keyof typeof TaskStatus];

  export const TaskPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type TaskPriority =
  (typeof TaskPriority)[keyof typeof TaskPriority];