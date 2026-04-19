import Project from '../models/Project';
import ProjectMember, { MemberRole } from '../models/ProjectMember';
import ActivityLog from '../models/ActivityLog';
import { CreateProjectDTO, UpdateProjectDTO } from '../dto/project.dto';

export class ProjectService {
  async createProject(userId: string, data: CreateProjectDTO) {
    const project = await Project.create({
      ...data,
      owner_id: userId,
    });
    
    await ProjectMember.create({
      project_id: project.id,
      user_id: userId,
      role: MemberRole.OWNER,
    });

    await ActivityLog.create({
      actor_id: userId,
      action: 'CREATED_PROJECT',
      entity_type: 'PROJECT',
      entity_id: project.id,
    });

    return project;
  }

  async getProjects(userId: string) {
    const memberships = await ProjectMember.find({ user_id: userId });
    const projectIds = memberships.map(m => m.project_id);
    return Project.find({ _id: { $in: projectIds } });
  }

  async getProjectById(userId: string, projectId: string) {
    const member = await ProjectMember.findOne({ user_id: userId, project_id: projectId });
    if (!member) throw new Error('Access denied');
    return Project.findById(projectId);
  }

  async updateProject(userId: string, projectId: string, data: UpdateProjectDTO) {
    const member = await ProjectMember.findOne({ user_id: userId, project_id: projectId });
    if (!member || (member.role !== MemberRole.OWNER && member.role !== MemberRole.ADMIN)) {
      throw new Error('Access denied');
    }
    const updated = await Project.findByIdAndUpdate(projectId, data, { new: true });
    
    await ActivityLog.create({
      actor_id: userId,
      action: 'UPDATED_PROJECT',
      entity_type: 'PROJECT',
      entity_id: projectId,
    });
    
    return updated;
  }

  async deleteProject(userId: string, projectId: string) {
    const member = await ProjectMember.findOne({ user_id: userId, project_id: projectId });
    if (!member || member.role !== MemberRole.OWNER) {
      throw new Error('Access denied');
    }
    await Project.findByIdAndDelete(projectId);
    await ProjectMember.deleteMany({ project_id: projectId });
    return { success: true };
  }
}
