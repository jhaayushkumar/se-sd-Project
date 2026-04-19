import mongoose, { Document, Schema } from 'mongoose';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ITask extends Document {
  title: string;
  description: string;
  project_id: mongoose.Types.ObjectId;
  assignee_id: mongoose.Types.ObjectId;
  creator_id: mongoose.Types.ObjectId;
  status: TaskStatus;
  priority: Priority;
  due_date: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignee_id: { type: Schema.Types.ObjectId, ref: 'User' },
    creator_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO },
    priority: { type: String, enum: Object.values(Priority), default: Priority.MEDIUM },
    due_date: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
