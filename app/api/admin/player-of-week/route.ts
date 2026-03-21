import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET() {
  try {
    const player = await prisma.playerOfWeek.findFirst({ where: { active: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(player || null)
  } catch {
    return NextResponse.json(null)
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await req.json()
    // Deactivate previous
    await prisma.playerOfWeek.updateMany({ where: { active: true }, data: { active: false } })
    const player = await prisma.playerOfWeek.create({ data: { ...data, active: true } })
    return NextResponse.json({ success: true, player })
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

// Deleting the data
export async function DELETE(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await prisma.playerOfWeek.updateMany({ where: { active: true }, data: { active: false } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to clear' }, { status: 500 })
  }
}
