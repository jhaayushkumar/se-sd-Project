import { ProjectStatus } from '../models/Project';

export interface CreateProjectDTO {
  name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  start_date?: Date;
  end_date?: Date;
}
