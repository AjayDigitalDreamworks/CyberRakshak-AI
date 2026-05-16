import mongoose from 'mongoose'

const threatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  message: String,
  source: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true })

export default mongoose.model('ThreatLog', threatLogSchema)
