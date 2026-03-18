// SMS via Fast2SMS (https://www.fast2sms.com) - free Indian SMS API
// Set FAST2SMS_API_KEY in .env to enable SMS

const SMS_API_KEY = process.env.FAST2SMS_API_KEY

async function sendSMS(phone: string, message: string): Promise<void> {
  if (!SMS_API_KEY || SMS_API_KEY === 'your-sms-api-key') {
    console.log(`[SMS SKIPPED - no API key] To: ${phone} | Msg: ${message}`)
    return
  }
  // Remove country code if present, keep 10 digits
  const mobile = phone.replace(/^(\+91|91)/, '').replace(/\D/g, '').slice(-10)
  if (mobile.length !== 10) return

  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: { authorization: SMS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ route: 'q', message, language: 'english', flash: 0, numbers: mobile })
    })
    const data = await res.json()
    if (!data.return) console.error('SMS failed:', data.message)
  } catch (e) {
    console.error('SMS send error:', e)
  }
}

export async function sendRegistrationSMS(phone: string, registrationId: string, name: string, isTeam: boolean) {
  const msg = isTeam
    ? `SPL U19: Team "${name}" registered successfully! Registration ID: ${registrationId}. Fee: Rs.11,000 pending. -SPL Committee`
    : `SPL U19: ${name} registered as individual player! Registration ID: ${registrationId}. You will be assigned to a district team. -SPL Committee`
  await sendSMS(phone, msg)
}

export async function sendApprovalSMS(phone: string, teamName: string, registrationId: string) {
  await sendSMS(phone, `SPL U19: Congratulations! Team "${teamName}" (ID: ${registrationId}) has been APPROVED. Check website for match schedule. -SPL Committee`)
}

export async function sendRejectionSMS(phone: string, teamName: string, registrationId: string, reason?: string) {
  await sendSMS(phone, `SPL U19: Team "${teamName}" (ID: ${registrationId}) registration was not approved.${reason ? ` Reason: ${reason}` : ''} Contact: support@splcricket.com -SPL`)
}

export async function sendMatchNotificationSMS(phone: string, teamName: string, opponent: string, venue: string, date: string) {
  await sendSMS(phone, `SPL U19 Match: ${teamName} vs ${opponent} at ${venue} on ${date}. Carry original documents. -SPL Committee`)
}
