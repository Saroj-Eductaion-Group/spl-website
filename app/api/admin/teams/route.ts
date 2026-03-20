import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: { select: { players: true } },
        payments: { select: { status: true, amount: true } },
        players: { select: { id: true, name: true, phone: true, role: true, aadhaarDoc: true, schoolIdDoc: true, dobProofDoc: true, photoDoc: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(teams)
  } catch {
    return NextResponse.json({ error: 'Failed to load teams' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { teamId, status, reason } = await request.json()
    const team = await prisma.team.update({ where: { id: teamId }, data: { status } })
    if (team.contactEmail) {
      try {
        if (status === 'APPROVED') await sendApprovalEmail(team.contactEmail, team.name, team.registrationId)
        else if (status === 'REJECTED') await sendRejectionEmail(team.contactEmail, team.name, team.registrationId, reason)
      } catch (e) { console.error('Email failed:', e) }
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update team status' }, { status: 500 })
  }
}