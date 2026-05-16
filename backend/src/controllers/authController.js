import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { signToken } from '../utils/jwt.js'
import { demoUsers } from '../services/demoStore.js'

function findDemoUser(email) {
  return demoUsers.find((u) => u.email === email)
}

export async function register(req, res) {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })

  try {
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    const token = signToken({ id: user._id, email: user.email })
    return res.status(201).json({ token, user: { name: user.name, email: user.email } })
  } catch {
    if (findDemoUser(email)) return res.status(409).json({ message: 'Email already exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = { _id: `${Date.now()}`, name, email, passwordHash }
    demoUsers.push(user)
    const token = signToken({ id: user._id, email: user.email })
    return res.status(201).json({ token, user: { name: user.name, email: user.email }, mode: 'demo' })
  }
}

export async function login(req, res) {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken({ id: user._id, email: user.email })
    return res.json({ token, user: { name: user.name, email: user.email } })
  } catch {
    const user = findDemoUser(email)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken({ id: user._id, email: user.email })
    return res.json({ token, user: { name: user.name, email: user.email }, mode: 'demo' })
  }
}
