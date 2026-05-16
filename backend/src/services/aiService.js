import axios from 'axios'

const ai = axios.create({ baseURL: process.env.AI_ENGINE_URL || 'http://localhost:8000', timeout: 5000 })

const SUSPICIOUS = ['verify', 'secure', 'login', 'bank', 'urgent', 'otp', 'reward', 'free', 'claim']
const TRUSTED_BRANDS = ['google', 'microsoft', 'amazon', 'apple', 'paypal', 'whatsapp', 'facebook', 'instagram']
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'shorturl.at', 'goo.gl', 'rebrand.ly']
const SAFE_HOSTS = ['google.com', 'github.com', 'openai.com', 'amazon.in', 'stackoverflow.com']
const HIGH_RISK_TLDS = ['ru', 'click', 'xyz', 'top', 'gq', 'tk']
const SCAM_URL_TOKENS = ['offer', 'claim', 'refund', 'alert', 'gift', 'prize', 'pay', 'bank', 'verify', 'secure', 'login', 'account', 'update', 'free', 'upi', 'delivery', 'bill']

function clamp(value, min = 0, max = 99) {
  return Math.max(min, Math.min(max, value))
}

function parseHost(rawUrl) {
  try {
    const withProto = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
    return new URL(withProto).hostname.toLowerCase()
  } catch {
    return rawUrl.toLowerCase()
  }
}

function evaluateUrl(url) {
  const lower = url.toLowerCase()
  const host = parseHost(url)
  let score = 3
  const keywordHits = SUSPICIOUS.filter((k) => lower.includes(k))
  const tokenHits = SCAM_URL_TOKENS.filter((k) => lower.includes(k))
  const reasons = []

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) { score += 35; reasons.push('IP address based URL') }
  if (host.length > 35) { score += 10; reasons.push('Unusually long domain') }
  if ((host.match(/-/g) || []).length >= 2) { score += 12; reasons.push('Multiple hyphens in domain') }
  if (/@/.test(url)) { score += 20; reasons.push('Contains @ redirection pattern') }
  if (/%[0-9a-f]{2}/i.test(url) || /%/.test(url)) { score += 8; reasons.push('Encoded URL characters') }
  if (SHORTENERS.includes(host)) { score += 25; reasons.push('URL shortener used') }

  for (const b of TRUSTED_BRANDS) {
    if (host.includes(b) && !host.endsWith(`${b}.com`) && !host.endsWith(`${b}.in`)) {
      score += 20
      reasons.push(`Possible brand impersonation: ${b}`)
      break
    }
  }

  const labels = host.split('.').filter(Boolean)
  if (labels.length && HIGH_RISK_TLDS.includes(labels[labels.length - 1])) {
    score += 20
    reasons.push(`High-risk TLD: .${labels[labels.length - 1]}`)
  }

  if (SAFE_HOSTS.includes(host) || SAFE_HOSTS.some((safe) => host.endsWith(`.${safe}`))) {
    score -= 25
    reasons.push('Known trusted domain')
  }

  score += Math.min(25, keywordHits.length * 7)
  score += Math.min(50, tokenHits.length * 6)
  if (keywordHits.length >= 3) reasons.push('High count of phishing keywords')
  else if (keywordHits.length > 0) reasons.push('Suspicious keywords present')
  if (tokenHits.length >= 3) reasons.push('Multiple scam-token matches')
  if (((host.match(/-/g) || []).length >= 2) && tokenHits.length >= 2) {
    score += 15
    reasons.push('Hyphenated domain with scam tokens')
  }
  if (lower.includes('verify') && (lower.includes('bank') || lower.includes('account'))) {
    score += 12
    reasons.push('Credential-harvest phrase combo')
  }
  if (lower.includes('free') && (lower.includes('gift') || lower.includes('iphone'))) {
    score += 20
    reasons.push('Free gift bait pattern')
  }
  if (lower.includes('upi') && lower.includes('refund') && lower.includes('alert')) {
    score += 24
    reasons.push('UPI refund alert scam pattern')
  }
  if (labels.length && HIGH_RISK_TLDS.includes(labels[labels.length - 1]) && tokenHits.length >= 1) {
    score += 10
    reasons.push('High-risk TLD with scam token')
  }
  if (/\.(gov|gov\.in|edu|org)$/i.test(host)) score -= 10

  const riskScore = clamp(score)
  const verdict = riskScore >= 70 ? 'Dangerous' : (riskScore >= 45 ? 'Review' : 'Safe')
  return { verdict, riskScore, keywords: keywordHits, signals: reasons, explanation: 'Fallback URL risk model analyzed domain structure and phishing signals.' }
}

function evaluateSms(message) {
  const text = message.toLowerCase()
  let score = 2
  const signals = []

  const patterns = [
    [/urgent|immediately|act now|last warning|final warning|tonight/, 20, 'urgency pressure'],
    [/otp|one[- ]?time|verification code|cvv|pin|verify/, 24, 'credential\/otp request'],
    [/click|tap|open link|visit/, 12, 'forced click action'],
    [/account (blocked|suspended|frozen)|k?yc pending|connection will be disconnected/, 20, 'account\/service threat language'],
    [/pay now|send money|upi|wallet|refund fee|unpaid customs fee|bill/, 22, 'payment pressure'],
    [/lottery|won|prize|reward|gift|lucky draw|congratulations/, 26, 'prize bait'],
    [/claim now|claim immediately/, 16, 'claim-pressure phrase'],
    [/parcel delivery failed|delivery failed|customs fee/, 18, 'delivery-failure payment trap'],
    [/kyc has expired|kyc expired|update kyc|failure to update|permanently block/, 34, 'kyc suspension fraud pattern'],
    [/whatsapp account.*another device|accessed from another device|secure your account/, 30, 'account hijack panic pattern'],
    [/income tax|tax department|refund will expire|claim before midnight/, 32, 'tax refund expiry scam'],
    [/electricity service.*disconnected|unpaid bill|final notice/, 30, 'utility cutoff threat pattern'],
    [/credit card|transaction detected|if not you/, 30, 'card fraud panic pattern'],
    [/work-from-home|selected for .*job|registration fee/, 32, 'fake job fee scam'],
    [/turn .* into .* in .*days|crypto|profit secret|limited slots/, 36, 'investment doubling scam'],
    [/legal warning|case has been registered|avoid arrest|cyber crime investigation/, 38, 'legal intimidation scam'],
    [/pending refund|complete verification to receive payment/, 30, 'refund verification trap'],
  ]

  for (const [pattern, points, label] of patterns) {
    if (pattern.test(text)) {
      score += points
      signals.push(label)
    }
  }

  if (/https?:\/\/|www\./.test(text)) { score += 14; signals.push('contains URL') }
  const linkMatch = text.match(/https?:\/\/[^\s]+/)
  if (linkMatch) {
    const linkHost = parseHost(linkMatch[0])
    const linkLabels = linkHost.split('.').filter(Boolean)
    if (linkLabels.length && HIGH_RISK_TLDS.includes(linkLabels[linkLabels.length - 1])) {
      score += 22
      signals.push(`link uses high-risk TLD .${linkLabels[linkLabels.length - 1]}`)
    }
    if (SAFE_HOSTS.includes(linkHost) || SAFE_HOSTS.some((safe) => linkHost.endsWith(`.${safe}`))) {
      score -= 22
      signals.push('link is trusted domain')
    }
    if ((linkHost.match(/-/g) || []).length >= 2) {
      score += 12
      signals.push('hyphen-heavy scam-style domain')
    }
  }
  if (/\b\d{4,}\b/.test(text) && (text.includes('otp') || text.includes('code'))) { score += 8; signals.push('numeric code context') }
  if (text.length < 40 && (text.includes('click') || text.includes('urgent'))) { score += 6; signals.push('short high-pressure message') }
  if (text.includes('amazon order has been shipped successfully')) { score -= 20; signals.push('benign transaction update phrase') }
  if (/₹\s?\d[\d,]+/.test(text) && /won|prize|reward|lucky draw/.test(text)) { score += 20; signals.push('money-prize bait amount') }
  if (/₹\s?\d{1,3}\b/.test(text) && /pay now|customs fee|delivery failed|bill/.test(text)) { score += 16; signals.push('small-fee urgency trap') }
  if (/₹\s?\d[\d,]{3,}/.test(text) && /refund|transaction|salary|lakh|credit card/.test(text)) { score += 20; signals.push('high-value money lure/threat') }
  if (/\b(15|30)\s*minutes?\b/.test(text)) { score += 16; signals.push('countdown pressure window') }
  if (/otp|verify|verification/.test(text) && /account|bank|card|whatsapp/.test(text)) { score += 16; signals.push('credential + account combo') }

  const scamProbability = clamp(score, 0, 98)
  const verdict = scamProbability >= 70 ? 'Dangerous' : (scamProbability >= 45 ? 'Review' : 'Safe')
  return { verdict, scamProbability, signals, explanation: 'Fallback SMS scam model evaluated urgency, payment pressure, and credential requests.' }
}

const localHeuristic = {
  url: (url) => evaluateUrl(url),
  sms: (message) => evaluateSms(message),
  screenshot: (filePath) => {
    const suspiciousName = /edit|modified|copy|screenshot\s*\(\d+\)/i.test(filePath)
    const explicitTamper = /fake|tamper|forged|photoshop/i.test(filePath)
    const manipulationConfidence = explicitTamper ? 80 : (suspiciousName ? 50 : 20)
    const verdict = manipulationConfidence >= 75 ? 'Dangerous' : (manipulationConfidence >= 40 ? 'Review' : 'Likely Genuine')
    return { verdict, manipulationConfidence, ocrText: 'OCR extraction requires full model pipeline', suspiciousRegions: ['metadata consistency check pending'], explanation: 'Fallback screenshot analysis is conservative to reduce false positives.' }
  },
  deepfake: (filePath) => {
    const suspiciousName = /deepfake|face[-_ ]?swap|ai[-_ ]?gen|synthetic/i.test(filePath)
    const deepfakeConfidence = suspiciousName ? 58 : 18
    const verdict = deepfakeConfidence >= 78 ? 'Dangerous' : (deepfakeConfidence >= 40 ? 'Review' : 'Likely Real')
    return { verdict, deepfakeConfidence, analyzedFrames: 0, artifacts: ['full frame-level model not active in fallback mode'], explanation: 'Fallback deepfake check returns low risk by default to avoid false positives.' }
  },
  audio: (filePath) => {
    const suspiciousName = /clone|tts|ai[-_ ]?voice|synthetic/i.test(filePath)
    const confidence = suspiciousName ? 60 : 18
    const dangerous = confidence >= 78
    const verdict = dangerous ? 'Dangerous' : (confidence >= 40 ? 'Review' : 'Likely Human')
    const classification = dangerous ? 'AI Generated Voice' : (confidence >= 40 ? 'Human/Uncertain' : 'Likely Human Voice')
    return { verdict, classification, confidence, explanation: 'Fallback audio check is conservative and avoids random false flags.' }
  },
}

async function callOrFallback(path, payload, fallbackFn) {
  try {
    const { data } = await ai.post(path, payload)
    return data
  } catch {
    return fallbackFn()
  }
}

export const aiAnalyzeUrl = async (url) => callOrFallback('/analyze/url', { url }, () => localHeuristic.url(url))
export const aiAnalyzeSms = async (message) => callOrFallback('/analyze/sms', { message }, () => localHeuristic.sms(message))
export const aiAnalyzeScreenshot = async (filePath) => callOrFallback('/analyze/screenshot', { filePath }, () => localHeuristic.screenshot(filePath))
export const aiAnalyzeDeepfake = async (filePath) => callOrFallback('/analyze/deepfake', { filePath }, () => localHeuristic.deepfake(filePath))
export const aiAnalyzeAudio = async (filePath) => callOrFallback('/analyze/audio', { filePath }, () => localHeuristic.audio(filePath))
