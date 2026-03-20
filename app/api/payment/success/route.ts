import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPaymentReceiptEmail } from '@/lib/email'
import { sendPaymentReceiptSMS } from '@/lib/sms'
import crypto from 'crypto'

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY || ''
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || ''

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const params = Object.fromEntries(formData.entries()) as Record<string, string>

    const { txnid, amount, email, firstname, udf1: registrationId, udf2: registrationType, udf3: teamId, udf4: playerId, status, hash } = params

    // Verify hash from Easebuzz
    if (EASEBUZZ_KEY && EASEBUZZ_SALT) {
      const reverseHash = `${EASEBUZZ_SALT}|${status}|||||||||||${email}|${firstname}|${params.productinfo}|${amount}|${txnid}|${EASEBUZZ_KEY}`
      const expectedHash = crypto.createHash('sha512').update(reverseHash).digest('hex')
      if (hash !== expectedHash) {
        return NextResponse.redirect(new URL('/payment/failed?reason=invalid_hash', request.url))
      }
    }

    if (status !== 'success') {
      return NextResponse.redirect(new URL('/payment/failed', request.url))
    }

    // Update payment record — team or individual
    if (teamId && teamId.length === 24) {
      await prisma.payment.updateMany({
        where: { teamId },
        data: { status: 'COMPLETED', transactionId: txnid, paymentId: txnid }
      })
    } else if (playerId && playerId.length === 24) {
      await prisma.payment.create({
        data: { amount: parseInt(amount), status: 'COMPLETED', transactionId: txnid, paymentId: txnid }
      })
    }

    // Send receipt email + SMS
    try {
      if (email) await sendPaymentReceiptEmail(email, firstname, registrationId, parseInt(amount), txnid)
    } catch (e) { console.error('Receipt email failed:', e) }

    // Get phone from team or player record for SMS
    try {
      let phone = ''
      if (teamId) {
        const team = await prisma.team.findUnique({ where: { id: teamId }, select: { contactPhone: true } })
        phone = team?.contactPhone || ''
      }
      if (phone) await sendPaymentReceiptSMS(phone, firstname, registrationId, parseInt(amount))
    } catch (e) { console.error('Receipt SMS failed:', e) }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    // encodeURIComponent sanitizes all user-provided values in redirect URL
    const safeUrl = new URL('/payment/success', baseUrl)
    safeUrl.searchParams.set('registrationId', registrationId || '')
    safeUrl.searchParams.set('txnid', txnid || '')
    safeUrl.searchParams.set('name', firstname || '')
    safeUrl.searchParams.set('type', registrationType || '')
    return NextResponse.redirect(safeUrl)
  } catch (error) {
    console.error('Payment success handler error:', error)
    return NextResponse.redirect(new URL('/payment/failed', request.url))
  }
}

// Also handle GET for dev mode redirects
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const registrationId = searchParams.get('registrationId') || ''
  const txnid = searchParams.get('txnid') || ''
  const name = searchParams.get('name') || ''
  const type = searchParams.get('type') || ''
  return NextResponse.redirect(
    new URL(`/payment/success?registrationId=${registrationId}&txnid=${txnid}&name=${encodeURIComponent(name)}&type=${type}`, request.url)
  )
}
