import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'spl-fallback-secret'

export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyAdminToken(request: NextRequest): string | null {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '').trim() || ''
    const decoded = jwt.verify(token, SECRET) as { userId: string; role: string }
    return decoded.role === 'ADMIN' ? decoded.userId : null
  } catch {
    return null
  }
}

export function verifyCoordinatorToken(request: NextRequest): string | null {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '').trim() || ''
    const decoded = jwt.verify(token, SECRET) as { userId: string; role: string }
    return decoded.role === 'COORDINATOR' ? decoded.userId : null
  } catch {
    return null
  }
}

export function verifyAnyStaffToken(request: NextRequest): { userId: string; role: string } | null {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '').trim() || ''
    const decoded = jwt.verify(token, SECRET) as { userId: string; role: string }
    if (decoded.role === 'ADMIN' || decoded.role === 'COORDINATOR') return decoded
    return null
  } catch {
    return null
  }
}
