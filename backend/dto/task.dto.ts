import { Priority, TaskStatus } from '../models/Task';

export interface CreateTaskDTO {
  title: string;
  description?: string;
  project_id: string;
  assignee_id?: string;
  priority?: Priority;
  due_date?: Date;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assignee_id?: string;
  due_date?: Date;
}
