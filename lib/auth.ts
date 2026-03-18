import { NextRequest } from 'next/server'

// Token format: "admin-{userId}" or "coordinator-{userId}"
export function verifyAdminToken(request: NextRequest): string | null {
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (!token.startsWith('admin-')) return null
  const userId = token.replace('admin-', '')
  return userId || null
}

export function verifyCoordinatorToken(request: NextRequest): string | null {
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (!token.startsWith('coordinator-')) return null
  const userId = token.replace('coordinator-', '')
  return userId || null
}

export function verifyAnyStaffToken(request: NextRequest): { userId: string; role: string } | null {
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (token.startsWith('admin-')) return { userId: token.replace('admin-', ''), role: 'ADMIN' }
  if (token.startsWith('coordinator-')) return { userId: token.replace('coordinator-', ''), role: 'COORDINATOR' }
  return null
}
