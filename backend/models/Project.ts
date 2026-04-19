import mongoose, { Document, Schema } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  ON_HOLD = 'ON_HOLD',
}

export interface IProject extends Document {
  name: string;
  description: string;
  status: ProjectStatus;
  owner_id: mongoose.Types.ObjectId;
  start_date: Date;
  end_date: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.ACTIVE },
    owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    start_date: { type: Date },
    end_date: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
