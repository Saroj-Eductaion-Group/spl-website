import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to load gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { title, url, category, type } = await request.json()
    if (!title || !url) return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    const item = await prisma.galleryItem.create({
      data: { title, url, category: category || 'General', type: type || 'photo', active: true }
    })
    return NextResponse.json({ success: true, item })
  } catch {
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, active } = await request.json()
    await prisma.galleryItem.update({ where: { id }, data: { active } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await request.json()
    await prisma.galleryItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
