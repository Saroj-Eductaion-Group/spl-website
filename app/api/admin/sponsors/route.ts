import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({ orderBy: [{ tier: 'asc' }, { createdAt: 'asc' }] })
    return NextResponse.json(sponsors)
  } catch {
    return NextResponse.json({ error: 'Failed to load sponsors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { name, tier, logoUrl, website } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    const sponsor = await prisma.sponsor.create({ data: { name, tier: tier || 'ASSOCIATE', logoUrl, website } })
    return NextResponse.json({ success: true, sponsor })
  } catch {
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, active } = await request.json()
    await prisma.sponsor.update({ where: { id }, data: { active } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await request.json()
    await prisma.sponsor.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 })
  }
}
