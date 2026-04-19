import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ProjectService } from '../services/project.service';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: AuthRequest, res: Response) {
    try {
      const result = await projectService.createProject(req.user.id, req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getProjects(req: AuthRequest, res: Response) {
    try {
      const result = await projectService.getProjects(req.user.id);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getProjectById(req: AuthRequest, res: Response) {
    try {
      const result = await projectService.getProjectById(req.user.id, req.params.id as string);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }

  async updateProject(req: AuthRequest, res: Response) {
    try {
      const result = await projectService.updateProject(req.user.id, req.params.id as string, req.body);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }

  async deleteProject(req: AuthRequest, res: Response) {
    try {
      const result = await projectService.deleteProject(req.user.id, req.params.id as string);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }
}
