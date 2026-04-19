import mongoose, { Document, Schema } from 'mongoose';

export enum MemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export interface IProjectMember extends Document {
  project_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  role: MemberRole;
  joined_at: Date;
}

const ProjectMemberSchema: Schema = new Schema(
  {
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: Object.values(MemberRole), default: MemberRole.MEMBER },
    joined_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IProjectMember>('ProjectMember', ProjectMemberSchema);
