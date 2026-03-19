import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const isAdmin = verifyAdminToken(request)
  try {
    const announcements = await prisma.announcement.findMany({
      where: isAdmin ? {} : { active: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(announcements)
  } catch {
    return NextResponse.json({ error: 'Failed to load announcements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { title, content, type } = await request.json()
    const announcement = await prisma.announcement.create({ data: { title, content, type: type || 'INFO', active: true } })
    return NextResponse.json({ success: true, announcement })
  } catch {
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, active } = await request.json()
    await prisma.announcement.update({ where: { id }, data: { active } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await request.json()
    await prisma.announcement.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 })
  }
}
