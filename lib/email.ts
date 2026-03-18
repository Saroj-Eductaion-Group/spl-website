import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const from = process.env.SMTP_USER

export const sendRegistrationEmail = async (
  email: string,
  registrationId: string,
  teamName?: string,
  playerName?: string
) => {
  const isTeam = !!teamName
  await transporter.sendMail({
    from,
    to: email,
    subject: `SPL Registration Confirmed — ${registrationId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#1e40af;">Saroj Premier League — Registration Confirmed</h2>
        <p>Dear ${isTeam ? `Team Manager (${teamName})` : playerName},</p>
        <p>Your registration for SPL U19 Cricket Tournament has been successfully submitted!</p>
        <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          ${isTeam ? `<p><strong>Team Name:</strong> ${teamName}</p>` : ''}
          <p><strong>Type:</strong> ${isTeam ? 'Team Registration' : 'Individual Registration'}</p>
          <p><strong>Fee:</strong> ₹${isTeam ? '11,000' : '1,000'}</p>
        </div>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Your registration is under review by the admin</li>
          <li>You will receive an approval/rejection notice shortly</li>
        </ul>
        <p>For queries: support@splcricket.com</p>
        <p>Best regards,<br/>SPL Tournament Committee</p>
      </div>
    `
  })
}

export const sendApprovalEmail = async (email: string, teamName: string, registrationId: string) => {
  await transporter.sendMail({
    from,
    to: email,
    subject: `SPL Registration Approved — ${registrationId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#16a34a;">Registration Approved! 🎉</h2>
        <p>Dear Team Manager,</p>
        <p>Congratulations! Your team <strong>${teamName}</strong> has been <strong style="color:#16a34a;">APPROVED</strong> for SPL U19 Cricket Tournament.</p>
        <div style="background:#f0fdf4;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #16a34a;">
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>Team:</strong> ${teamName}</p>
          <p><strong>Status:</strong> Approved ✅</p>
        </div>
        <p>Please check the tournament schedule on our website for match details.</p>
        <p>Best regards,<br/>SPL Tournament Committee</p>
      </div>
    `
  })
}

export const sendRejectionEmail = async (email: string, teamName: string, registrationId: string, reason?: string) => {
  await transporter.sendMail({
    from,
    to: email,
    subject: `SPL Registration Update — ${registrationId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#dc2626;">Registration Status Update</h2>
        <p>Dear Team Manager,</p>
        <p>We regret to inform you that your team <strong>${teamName}</strong> registration has been <strong style="color:#dc2626;">REJECTED</strong>.</p>
        <div style="background:#fef2f2;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #dc2626;">
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>Team:</strong> ${teamName}</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        </div>
        <p>For queries or to re-register, contact: support@splcricket.com</p>
        <p>Best regards,<br/>SPL Tournament Committee</p>
      </div>
    `
  })
}

export const sendMatchNotificationEmail = async (
  email: string,
  teamName: string,
  opponent: string,
  venue: string,
  date: string
) => {
  await transporter.sendMail({
    from,
    to: email,
    subject: `SPL Match Schedule — ${teamName} vs ${opponent}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#1e40af;">Match Schedule Notification</h2>
        <p>Dear Team Manager,</p>
        <p>Your upcoming match details:</p>
        <div style="background:#eff6ff;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #1e40af;">
          <p><strong>${teamName}</strong> vs <strong>${opponent}</strong></p>
          <p><strong>Venue:</strong> ${venue}</p>
          <p><strong>Date & Time:</strong> ${date}</p>
        </div>
        <p>Please ensure all players carry their original documents to the match.</p>
        <p>Best regards,<br/>SPL Tournament Committee</p>
      </div>
    `
  })
}
