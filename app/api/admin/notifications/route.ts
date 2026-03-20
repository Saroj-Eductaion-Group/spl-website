import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  requireTLS: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { subject, message, teamIds } = await req.json()
    if (!subject || !message || !teamIds?.length) {
      return NextResponse.json({ error: 'subject, message and teamIds are required' }, { status: 400 })
    }

    const teams = await prisma.team.findMany({
      where: { id: { in: teamIds }, contactEmail: { not: null } },
      select: { id: true, name: true, contactEmail: true, registrationId: true }
    })

    let sent = 0, failed = 0

    for (const team of teams) {
      if (!team.contactEmail) continue
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: team.contactEmail,
          subject: `SPL — ${subject}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#1e40af;">Saroj Premier League — Official Notice</h2>
              <p>Dear Team Manager (${team.name}),</p>
              <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;white-space:pre-line;">
                ${message.replace(/\n/g, '<br/>')}
              </div>
              <p style="font-size:12px;color:#6b7280;">Registration ID: ${team.registrationId}</p>
              <p>Best regards,<br/>SPL Tournament Committee</p>
            </div>
          `
        })
        sent++
      } catch {
        failed++
      }
    }

    return NextResponse.json({ success: true, sent, failed })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}
