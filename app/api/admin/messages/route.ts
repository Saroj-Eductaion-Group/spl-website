import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(messages)
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.contactMessage.update({ where: { id }, data: { read: true } })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.contactMessage.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
