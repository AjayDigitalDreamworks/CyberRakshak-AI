import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import scanRoutes from './routes/scanRoutes.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

function parseAllowedOrigins() {
  const raw = process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173'
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
}

const allowedOrigins = parseAllowedOrigins()

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) return callback(null, true)

    // allow local dev hosts: localhost, 127.0.0.1, and private LAN IPs on port 5173
    const devHostPattern = /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):5173$/
    if (devHostPattern.test(origin)) return callback(null, true)

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
}

app.use(helmet())
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }))

app.get('/health', (_req, res) => res.json({ ok: true, service: 'backend' }))
app.use('/api/auth', authRoutes)
app.use('/api', scanRoutes)

app.use((err, _req, res, _next) => {
  if (err?.message?.startsWith('CORS blocked')) {
    return res.status(403).json({ message: err.message })
  }
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

async function start() {
  let dbConnected = false
  try {
    await connectDB(process.env.MONGODB_URI)
    dbConnected = true
  } catch (err) {
    console.warn('MongoDB unavailable. Running in demo in-memory mode.')
    console.warn(err?.message || err)
  }

  app.listen(port, () => {
    console.log(`Backend running on ${port}`)
    console.log(`Mode: ${dbConnected ? 'production-db' : 'demo-in-memory'}`)
    console.log(`CORS allowlist: ${allowedOrigins.join(', ')}`)
  })
}

start()

