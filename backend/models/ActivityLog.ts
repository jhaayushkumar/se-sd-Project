import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  actor_id: mongoose.Types.ObjectId;
  action: string;
  entity_type: string;
  entity_id: mongoose.Types.ObjectId;
  details: string;
  timestamp: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    actor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entity_type: { type: String, required: true },
    entity_id: { type: Schema.Types.ObjectId, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
