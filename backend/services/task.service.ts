import Task from '../models/Task';
import ProjectMember from '../models/ProjectMember';
import ActivityLog from '../models/ActivityLog';
import { CreateTaskDTO, UpdateTaskDTO } from '../dto/task.dto';

export class TaskService {
  async createTask(userId: string, data: CreateTaskDTO) {
    const member = await ProjectMember.findOne({ user_id: userId, project_id: data.project_id });
    if (!member) throw new Error('Access denied to project');

    const task = await Task.create({
      ...data,
      creator_id: userId,
    });

    await ActivityLog.create({
      actor_id: userId,
      action: 'CREATED_TASK',
      entity_type: 'TASK',
      entity_id: task.id,
    });

    return task;
  }

  async getTasksByProject(userId: string, projectId: string) {
    const member = await ProjectMember.findOne({ user_id: userId, project_id: projectId });
    if (!member) throw new Error('Access denied');
    return Task.find({ project_id: projectId });
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskDTO) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    
    const member = await ProjectMember.findOne({ user_id: userId, project_id: task.project_id });
    if (!member) throw new Error('Access denied');

    const updated = await Task.findByIdAndUpdate(taskId, data, { new: true });

    await ActivityLog.create({
      actor_id: userId,
      action: 'UPDATED_TASK',
      entity_type: 'TASK',
      entity_id: taskId,
    });

    return updated;
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    
    const member = await ProjectMember.findOne({ user_id: userId, project_id: task.project_id });
    if (!member) throw new Error('Access denied');

    await Task.findByIdAndDelete(taskId);
    return { success: true };
  }
}
