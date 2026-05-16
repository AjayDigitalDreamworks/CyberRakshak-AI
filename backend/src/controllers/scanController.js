import path from 'path'
import Scan from '../models/Scan.js'
import Report from '../models/Report.js'
import ThreatLog from '../models/ThreatLog.js'
import UserSettings from '../models/UserSettings.js'
import { demoReports, demoScans, demoSettings, demoThreatLogs } from '../services/demoStore.js'
import { aiAnalyzeAudio, aiAnalyzeDeepfake, aiAnalyzeScreenshot, aiAnalyzeSms, aiAnalyzeUrl } from '../services/aiService.js'

function extractRisk(aiResult) {
  return Math.round(Number(aiResult.riskScore ?? aiResult.scamProbability ?? aiResult.deepfakeConfidence ?? aiResult.manipulationConfidence ?? aiResult.confidence ?? 0))
}

async function saveScanAndReport(req, scanType, payload, aiResult) {
  const riskScore = extractRisk(aiResult)
  try {
    const scan = await Scan.create({ userId: req.user.id, scanType, ...payload, ...aiResult, riskScore })
    await Report.create({ userId: req.user.id, scanId: scan._id, scanType, verdict: aiResult.verdict, riskScore, summary: aiResult.explanation || 'Automated threat analysis generated.' })
    if (riskScore >= 70) {
      await ThreatLog.create({ userId: req.user.id, severity: riskScore >= 85 ? 'critical' : 'high', message: `${scanType} threat flagged (${riskScore})`, source: scanType, metadata: aiResult })
    }
    return scan
  } catch {
    const scan = { _id: `${Date.now()}`, userId: req.user.id, scanType, ...payload, ...aiResult, riskScore, createdAt: new Date().toISOString() }
    demoScans.push(scan)
    demoReports.push({ _id: `${Date.now()}-r`, userId: req.user.id, scanId: scan._id, scanType, verdict: aiResult.verdict, riskScore, summary: aiResult.explanation || 'Automated threat analysis generated.', createdAt: scan.createdAt })
    if (riskScore >= 70) {
      demoThreatLogs.push({ userId: req.user.id, severity: riskScore >= 85 ? 'critical' : 'high', source: scanType, message: `${scanType} threat flagged (${riskScore})`, metadata: aiResult, createdAt: scan.createdAt })
    }
    return scan
  }
}

export async function urlScan(req, res) {
  const { url } = req.body
  if (!url) return res.status(400).json({ message: 'url required' })
  const result = await aiAnalyzeUrl(url)
  await saveScanAndReport(req, 'url', { inputType: 'text', inputValue: url }, result)
  res.json({ ...result, riskScore: extractRisk(result) })
}

export async function smsScan(req, res) {
  const { message } = req.body
  if (!message) return res.status(400).json({ message: 'message required' })
  const result = await aiAnalyzeSms(message)
  await saveScanAndReport(req, 'sms', { inputType: 'text', inputValue: message }, result)
  res.json({ ...result, riskScore: extractRisk(result) })
}

export async function screenshotScan(req, res) {
  if (!req.file) return res.status(400).json({ message: 'file required' })
  const result = await aiAnalyzeScreenshot(path.resolve(req.file.path))
  await saveScanAndReport(req, 'screenshot', { inputType: 'file', inputValue: req.file.path }, result)
  res.json({ ...result, riskScore: extractRisk(result) })
}

export async function deepfakeScan(req, res) {
  if (!req.file) return res.status(400).json({ message: 'file required' })
  const result = await aiAnalyzeDeepfake(path.resolve(req.file.path))
  await saveScanAndReport(req, 'deepfake', { inputType: 'file', inputValue: req.file.path }, result)
  res.json({ ...result, riskScore: extractRisk(result) })
}

export async function audioScan(req, res) {
  if (!req.file) return res.status(400).json({ message: 'file required' })
  const result = await aiAnalyzeAudio(path.resolve(req.file.path))
  await saveScanAndReport(req, 'audio', { inputType: 'file', inputValue: req.file.path }, result)
  res.json({ ...result, riskScore: extractRisk(result) })
}

export async function getReports(req, res) {
  try {
    const reports = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100)
    return res.json({ reports })
  } catch {
    const reports = demoReports.filter((r) => r.userId === req.user.id).slice().reverse()
    return res.json({ reports, mode: 'demo' })
  }
}

function buildTrend(scans) {
  const labels = []
  const values = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }))
    values.push(scans.filter((s) => (new Date(s.createdAt)).toISOString().slice(0, 10) === key && Number(s.riskScore || 0) >= 70).length)
  }
  return { labels, values }
}

export async function getDashboardSummary(req, res) {
  try {
    const scans = await Scan.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(1000)
    const dangerous = scans.filter((s) => Number(s.riskScore || 0) >= 70)
    const deepfakes = scans.filter((s) => s.scanType === 'deepfake' && Number(s.riskScore || 0) >= 60)
    const avg = scans.length ? Math.round(scans.reduce((a, b) => a + Number(b.riskScore || 0), 0) / scans.length) : 0
    return res.json({ totalScans: scans.length, dangerousScans: dangerous.length, deepfakes: deepfakes.length, securityScore: Math.max(0, 100 - avg), trend: buildTrend(scans) })
  } catch {
    const scans = demoScans.filter((s) => s.userId === req.user.id)
    const dangerous = scans.filter((s) => Number(s.riskScore || 0) >= 70)
    const deepfakes = scans.filter((s) => s.scanType === 'deepfake' && Number(s.riskScore || 0) >= 60)
    const avg = scans.length ? Math.round(scans.reduce((a, b) => a + Number(b.riskScore || 0), 0) / scans.length) : 0
    return res.json({ totalScans: scans.length, dangerousScans: dangerous.length, deepfakes: deepfakes.length, securityScore: Math.max(0, 100 - avg), trend: buildTrend(scans), mode: 'demo' })
  }
}

export async function getThreatAlerts(req, res) {
  try {
    const logs = await ThreatLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10)
    return res.json({ alerts: logs.map((l) => ({ id: l._id, message: l.message, severity: l.severity, createdAt: l.createdAt })) })
  } catch {
    const alerts = demoThreatLogs.filter((l) => l.userId === req.user.id).slice(-10).reverse()
    return res.json({ alerts })
  }
}

export async function getPublicStats(_req, res) {
  try {
    const totalScans = await Scan.countDocuments()
    const dangerousScans = await Scan.countDocuments({ riskScore: { $gte: 70 } })
    const deepfakes = await Scan.countDocuments({ scanType: 'deepfake', riskScore: { $gte: 60 } })
    const reports = await Report.countDocuments()
    return res.json({ totalScans, dangerousScans, deepfakes, reports, aiConfidence: 96 })
  } catch {
    return res.json({ totalScans: demoScans.length, dangerousScans: demoScans.filter((s) => Number(s.riskScore || 0) >= 70).length, deepfakes: demoScans.filter((s) => s.scanType === 'deepfake').length, reports: demoReports.length, aiConfidence: 96, mode: 'demo' })
  }
}

export async function getSettings(req, res) {
  try {
    const settings = await UserSettings.findOne({ userId: req.user.id })
    if (!settings) return res.json({ emailAlerts: true, riskThreshold: 70 })
    return res.json({ emailAlerts: settings.emailAlerts, riskThreshold: settings.riskThreshold })
  } catch {
    const settings = demoSettings.find((s) => s.userId === req.user.id) || { emailAlerts: true, riskThreshold: 70 }
    return res.json(settings)
  }
}

export async function updateSettings(req, res) {
  const emailAlerts = Boolean(req.body.emailAlerts)
  const riskThreshold = Math.max(10, Math.min(95, Number(req.body.riskThreshold || 70)))
  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { emailAlerts, riskThreshold } },
      { upsert: true, new: true },
    )
    return res.json({ emailAlerts: settings.emailAlerts, riskThreshold: settings.riskThreshold })
  } catch {
    const existing = demoSettings.find((s) => s.userId === req.user.id)
    if (existing) {
      existing.emailAlerts = emailAlerts
      existing.riskThreshold = riskThreshold
      return res.json(existing)
    }
    const created = { userId: req.user.id, emailAlerts, riskThreshold }
    demoSettings.push(created)
    return res.json(created)
  }
}
