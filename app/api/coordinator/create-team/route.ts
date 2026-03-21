import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCoordinatorToken } from '@/lib/auth'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  const userId = verifyCoordinatorToken(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { name, schoolCollege, district } = await request.json()
    if (!name || !schoolCollege || !district) {
      return NextResponse.json({ error: 'name, schoolCollege and district are required' }, { status: 400 })
    }
    const coordinator = await prisma.user.findUnique({ where: { id: userId }, select: { coordinatorDistrict: true } })
    if (coordinator?.coordinatorDistrict && district !== coordinator.coordinatorDistrict) {
      return NextResponse.json({ error: 'Unauthorized: can only create teams in your district' }, { status: 403 })
    }
    const registrationId = `SPL${nanoid(8).toUpperCase()}`
    const team = await prisma.team.create({
      data: { name, schoolCollege, district, registrationId, createdById: userId, status: 'APPROVED' }
    })
    return NextResponse.json({ success: true, team })
  } catch {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}
