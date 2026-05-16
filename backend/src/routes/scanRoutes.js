import express from 'express'
import multer from 'multer'
import { audioScan, deepfakeScan, getDashboardSummary, getPublicStats, getReports, getSettings, getThreatAlerts, screenshotScan, smsScan, updateSettings, urlScan } from '../controllers/scanController.js'
import { auth } from '../middleware/auth.js'

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.get('/public/stats', getPublicStats)

router.post('/url-scan', auth, urlScan)
router.post('/sms-scan', auth, smsScan)
router.post('/screenshot', auth, upload.single('file'), screenshotScan)
router.post('/deepfake', auth, upload.single('file'), deepfakeScan)
router.post('/audio-scan', auth, upload.single('file'), audioScan)
router.get('/reports', auth, getReports)
router.get('/dashboard/summary', auth, getDashboardSummary)
router.get('/threat-alerts', auth, getThreatAlerts)
router.get('/settings', auth, getSettings)
router.put('/settings', auth, updateSettings)

export default router
