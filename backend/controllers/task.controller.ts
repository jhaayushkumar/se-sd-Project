import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TaskService } from '../services/task.service';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthRequest, res: Response) {
    try {
      const result = await taskService.createTask(req.user.id, req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getProjectTasks(req: AuthRequest, res: Response) {
    try {
      const result = await taskService.getTasksByProject(req.user.id, req.params.projectId as string);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const result = await taskService.updateTask(req.user.id, req.params.id as string, req.body);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const result = await taskService.deleteTask(req.user.id, req.params.id as string);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }
}
