import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scan' },
  scanType: String,
  verdict: String,
  riskScore: Number,
  summary: String,
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)
