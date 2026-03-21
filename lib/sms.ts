// SMS via Fast2SMS (https://www.fast2sms.com)
// Set FAST2SMS_API_KEY in .env to enable SMS

const SMS_API_KEY = process.env.FAST2SMS_API_KEY

async function sendSMS(phone: string, message: string): Promise<void> {
  if (!SMS_API_KEY || SMS_API_KEY.startsWith('your-')) {
    console.log('[SMS SKIPPED - no API key configured]')
    return
  }
  const mobile = phone.replace(/^(\+91|91)/, '').replace(/\D/g, '').slice(-10)
  if (mobile.length !== 10) return

  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: { authorization: SMS_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ route: 'q', message, language: 'english', flash: 0, numbers: mobile })
    })
    const data = await res.json()
    if (!data.return) console.error('SMS send failed')
  } catch {
    console.error('SMS send error')
  }
}

export async function sendRegistrationSMS(phone: string, registrationId: string, name: string, isTeam: boolean) {
  const msg = isTeam
    ? `SPL U19: Team registered! ID: ${registrationId}. Fee Rs.11,000 pending. -SPL Committee`
    : `SPL U19: Individual registration done! ID: ${registrationId}. You will be assigned to a district team. -SPL Committee`
  await sendSMS(phone, msg)
}

export async function sendApprovalSMS(phone: string, teamName: string, registrationId: string) {
  await sendSMS(phone, `SPL U19: Team approved! ID: ${registrationId}. Check website for schedule. -SPL Committee`)
}

export async function sendRejectionSMS(phone: string, teamName: string, registrationId: string, reason?: string) {
  await sendSMS(phone, `SPL U19: Registration ID ${registrationId} was not approved. Contact: support@splcricket.com -SPL`)
}

export async function sendPaymentReceiptSMS(phone: string, name: string, registrationId: string, amount: number) {
  await sendSMS(phone, `SPL U19: Payment Rs.${amount} received. ID: ${registrationId}. Registration under review. -SPL Committee`)
}

export async function sendMatchNotificationSMS(phone: string, teamName: string, opponent: string, venue: string, date: string) {
  await sendSMS(phone, `SPL U19 Match alert! Check website for your match details. Carry original documents. -SPL Committee`)
}

export async function sendSMSBlast(phones: string[], message: string) {
  for (const phone of phones) {
    try { await sendSMS(phone, message) } catch { }
  }
}
