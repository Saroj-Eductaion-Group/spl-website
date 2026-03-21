import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email'
import { sendApprovalSMS, sendRejectionSMS } from '@/lib/sms'
import { verifyCoordinatorToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyCoordinatorToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const teams = await prisma.team.findMany({
      where: district ? { district } : {},
      include: {
        _count: { select: { players: true } },
        payments: { select: { status: true, amount: true } },
        players: { select: { id: true, name: true, phone: true, role: true, isIndividual: true, aadhaarDoc: true, schoolIdDoc: true, dobProofDoc: true, photoDoc: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load teams' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const userId = verifyCoordinatorToken(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { teamId, status, reason } = await request.json()

    // Verify the team belongs to this coordinator's district
    const coordinator = await prisma.user.findUnique({ where: { id: userId }, select: { coordinatorDistrict: true } })
    const team = await prisma.team.findUnique({ where: { id: teamId }, select: { district: true, contactEmail: true, name: true, registrationId: true } })
    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    if (coordinator?.coordinatorDistrict && team.district !== coordinator.coordinatorDistrict) {
      return NextResponse.json({ error: 'Unauthorized: team is not in your district' }, { status: 403 })
    }

    await prisma.team.update({ where: { id: teamId }, data: { status } })
    if (team.contactEmail) {
      try {
        if (status === 'APPROVED') await sendApprovalEmail(team.contactEmail, team.name, team.registrationId)
        else if (status === 'REJECTED') await sendRejectionEmail(team.contactEmail, team.name, team.registrationId, reason)
      } catch (e) { console.error('Email failed:', e) }
    }
    const teamFull = await prisma.team.findUnique({ where: { id: teamId }, select: { contactPhone: true } })
    if (teamFull?.contactPhone) {
      try {
        if (status === 'APPROVED') await sendApprovalSMS(teamFull.contactPhone, team.name, team.registrationId)
        else if (status === 'REJECTED') await sendRejectionSMS(teamFull.contactPhone, team.name, team.registrationId, reason)
      } catch (e) { console.error('SMS failed:', e) }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}
