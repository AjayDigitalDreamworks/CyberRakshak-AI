import mongoose from 'mongoose'

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scanType: { type: String, required: true },
  inputType: String,
  inputValue: String,
  verdict: String,
  riskScore: Number,
  confidence: Number,
  details: mongoose.Schema.Types.Mixed,
}, { timestamps: true })

export default mongoose.model('Scan', scanSchema)
