import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Auto-create default admin if not exists
    if (email === 'admin@spl.com') {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (!existing) {
        const hashed = await bcrypt.hash('admin123', 10)
        await prisma.user.create({
          data: { email: 'admin@spl.com', password: hashed, role: 'ADMIN', name: 'SPL Administrator' }
        })
      }
    }

    const admin = await prisma.user.findUnique({ where: { email } })
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      token: signToken({ userId: admin.id, role: 'ADMIN' }),
      user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
