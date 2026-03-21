import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to prevent email enumeration
    if (!user || user.role !== 'COORDINATOR') {
      return NextResponse.json({ success: true })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/coordinator/reset-password?token=${token}`

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      requireTLS: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'SPL — Reset Your Coordinator Password',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#002366;">Password Reset Request</h2>
        <p>Dear ${user.name || 'Coordinator'},</p>
        <p>Click the button below to reset your SPL Coordinator password. This link expires in <strong>1 hour</strong>.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${resetUrl}" style="background:#ffd700;color:#002366;padding:14px 32px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block;">Reset Password</a>
        </div>
        <p style="color:#666;font-size:12px;">If you did not request this, ignore this email. Your password will remain unchanged.</p>
        <p>Best regards,<br/>SPL Tournament Committee</p>
      </div>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to send reset email. Please try again.' }, { status: 500 })
  }
}
