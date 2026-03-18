import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email'
import { sendApprovalSMS, sendRejectionSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const { teamId, status, reason } = await request.json()

    const team = await prisma.team.update({
      where: { id: teamId },
      data: { status }
    })

    if (team.contactEmail) {
      try {
        if (status === 'APPROVED') await sendApprovalEmail(team.contactEmail, team.name, team.registrationId)
        else if (status === 'REJECTED') await sendRejectionEmail(team.contactEmail, team.name, team.registrationId, reason)
      } catch (e) { console.error('Email failed:', e) }
    }
    if (team.contactPhone) {
      try {
        if (status === 'APPROVED') await sendApprovalSMS(team.contactPhone, team.name, team.registrationId)
        else if (status === 'REJECTED') await sendRejectionSMS(team.contactPhone, team.name, team.registrationId, reason)
      } catch (e) { console.error('SMS failed:', e) }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team status' }, { status: 500 })
  }
}
