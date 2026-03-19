import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()
    if (!name || !email || !message)
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })

    await prisma.contactMessage.create({ data: { name, email, phone, subject, message } })

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      })
      await transporter.sendMail({
        from: process.env.SMTP_USER, to: process.env.SMTP_USER, replyTo: email,
        subject: `SPL Contact: ${subject || 'General Inquiry'} — ${name}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;">
          <h2 style="color:#1e40af;">New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || 'Not provided'}</p>
          <p><b>Subject:</b> ${subject || 'General Inquiry'}</p>
          <p><b>Message:</b><br/>${message}</p>
        </div>`
      })
    } catch { /* email failure shouldn't block the response */ }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
