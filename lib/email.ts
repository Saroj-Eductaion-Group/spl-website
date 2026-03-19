import nodemailer from 'nodemailer'

// Sanitize user input to prevent XSS in email HTML
const s = (str: string) => String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  requireTLS: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const from = process.env.SMTP_USER

export const sendRegistrationEmail = async (email: string, registrationId: string, teamName?: string, playerName?: string) => {
  const isTeam = !!teamName
  await transporter.sendMail({
    from, to: email,
    subject: `SPL Registration Confirmed — ${s(registrationId)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1e40af;">Saroj Premier League — Registration Confirmed</h2>
      <p>Dear ${isTeam ? `Team Manager (${s(teamName!)})` : s(playerName || '')},</p>
      <p>Your registration for SPL U19 Cricket Tournament has been successfully submitted!</p>
      <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;">
        <p><strong>Registration ID:</strong> ${s(registrationId)}</p>
        ${isTeam ? `<p><strong>Team Name:</strong> ${s(teamName!)}</p>` : ''}
        <p><strong>Type:</strong> ${isTeam ? 'Team Registration' : 'Individual Registration'}</p>
        <p><strong>Fee:</strong> ₹${isTeam ? '11,000' : '1,000'}</p>
      </div>
      <p>For queries: support@splcricket.com</p>
      <p>Best regards,<br/>SPL Tournament Committee</p>
    </div>`
  })
}

export const sendApprovalEmail = async (email: string, teamName: string, registrationId: string) => {
  await transporter.sendMail({
    from, to: email,
    subject: `SPL Registration Approved — ${s(registrationId)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#16a34a;">Registration Approved! 🎉</h2>
      <p>Congratulations! Team <strong>${s(teamName)}</strong> has been <strong style="color:#16a34a;">APPROVED</strong>.</p>
      <div style="background:#f0fdf4;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #16a34a;">
        <p><strong>Registration ID:</strong> ${s(registrationId)}</p>
        <p><strong>Status:</strong> Approved ✅</p>
      </div>
      <p>Best regards,<br/>SPL Tournament Committee</p>
    </div>`
  })
}

export const sendRejectionEmail = async (email: string, teamName: string, registrationId: string, reason?: string) => {
  await transporter.sendMail({
    from, to: email,
    subject: `SPL Registration Update — ${s(registrationId)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#dc2626;">Registration Status Update</h2>
      <p>Team <strong>${s(teamName)}</strong> registration has been <strong style="color:#dc2626;">REJECTED</strong>.</p>
      <div style="background:#fef2f2;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #dc2626;">
        <p><strong>Registration ID:</strong> ${s(registrationId)}</p>
        ${reason ? `<p><strong>Reason:</strong> ${s(reason)}</p>` : ''}
      </div>
      <p>Contact: support@splcricket.com</p>
      <p>Best regards,<br/>SPL Tournament Committee</p>
    </div>`
  })
}

export const sendPaymentReceiptEmail = async (email: string, name: string, registrationId: string, amount: number, transactionId: string) => {
  await transporter.sendMail({
    from, to: email,
    subject: `SPL Payment Receipt — ${s(registrationId)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#16a34a;">Payment Received ✅</h2>
      <p>Dear ${s(name)},</p>
      <div style="background:#f0fdf4;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #16a34a;">
        <p><strong>Registration ID:</strong> ${s(registrationId)}</p>
        <p><strong>Amount Paid:</strong> ₹${amount.toLocaleString('en-IN')}</p>
        <p><strong>Transaction ID:</strong> ${s(transactionId)}</p>
        <p><strong>Status:</strong> Paid ✅</p>
      </div>
      <p>Best regards,<br/>SPL Tournament Committee</p>
    </div>`
  })
}

export const sendMatchNotificationEmail = async (email: string, teamName: string, opponent: string, venue: string, date: string) => {
  await transporter.sendMail({
    from, to: email,
    subject: `SPL Match Schedule — ${s(teamName)} vs ${s(opponent)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1e40af;">Match Schedule Notification</h2>
      <div style="background:#eff6ff;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #1e40af;">
        <p><strong>${s(teamName)}</strong> vs <strong>${s(opponent)}</strong></p>
        <p><strong>Venue:</strong> ${s(venue)}</p>
        <p><strong>Date & Time:</strong> ${s(date)}</p>
      </div>
      <p>Best regards,<br/>SPL Tournament Committee</p>
    </div>`
  })
}
