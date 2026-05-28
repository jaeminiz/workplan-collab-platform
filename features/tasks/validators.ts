import { z } from "zod";

import { taskStatuses, taskTypes } from "@/features/tasks/constants";

export const createTaskSchema = z.object({
  title: z.string().trim().min(2).max(160),
  projectCode: z.string().trim().min(1).max(80),
  customer: z.string().trim().min(1).max(80),
  type: z.enum(taskTypes),
  status: z.enum(taskStatuses).default("미착수"),
  assignee: z.string().trim().min(1).max(80),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskStatusSchema = z.object({
  status: z.enum(taskStatuses)
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

export const createTaskCommentSchema = z.object({
  body: z.string().trim().min(2).max(2000)
});

export type CreateTaskCommentInput = z.infer<typeof createTaskCommentSchema>;
