import jwt from 'jsonwebtoken'

const FALLBACK_JWT_SECRET = 'cyberrakshak-dev-secret-change-in-production'

function getJwtSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) {
    return process.env.JWT_SECRET
  }

  console.warn('JWT_SECRET is missing. Using temporary development secret. Set JWT_SECRET in backend/.env for production.')
  return FALLBACK_JWT_SECRET
}

export const signToken = (payload) => jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
export const verifyToken = (token) => jwt.verify(token, getJwtSecret())
