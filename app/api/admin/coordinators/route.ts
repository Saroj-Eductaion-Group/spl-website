import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const coordinators = await prisma.user.findMany({
      where: { role: 'COORDINATOR' },
      select: { id: true, name: true, email: true, phone: true, coordinatorDistrict: true, createdAt: true }
    })
    return NextResponse.json(coordinators)
  } catch {
    return NextResponse.json({ error: 'Failed to load coordinators' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { name, email, phone, password, district } = await request.json()
    const hashedPassword = await bcrypt.hash(password, 10)
    const coordinator = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword, role: 'COORDINATOR', coordinatorDistrict: district }
    })
    return NextResponse.json({ success: true, coordinator: { id: coordinator.id, name: coordinator.name, email: coordinator.email, district: coordinator.coordinatorDistrict } })
  } catch {
    return NextResponse.json({ error: 'Failed to create coordinator' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await request.json()
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete coordinator' }, { status: 500 })
  }
}
