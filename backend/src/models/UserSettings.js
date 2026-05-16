import mongoose from 'mongoose'

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  emailAlerts: { type: Boolean, default: true },
  riskThreshold: { type: Number, default: 70 },
}, { timestamps: true })

export default mongoose.model('UserSettings', userSettingsSchema)
