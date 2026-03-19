import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPaymentReceiptEmail } from '@/lib/email'
import crypto from 'crypto'

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY || ''
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || ''

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const params = Object.fromEntries(formData.entries()) as Record<string, string>

    const { txnid, amount, email, firstname, udf1: registrationId, udf2: registrationType, udf3: teamId, status, hash } = params

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

    // Update payment record
    if (teamId) {
      await prisma.payment.updateMany({
        where: { teamId },
        data: { status: 'COMPLETED', transactionId: txnid, paymentId: txnid }
      })
    }

    // Send receipt email
    try {
      if (email) {
        await sendPaymentReceiptEmail(email, firstname, registrationId, parseInt(amount), txnid)
      }
    } catch (e) { console.error('Receipt email failed:', e) }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    return NextResponse.redirect(
      new URL(`/payment/success?registrationId=${registrationId}&txnid=${txnid}&name=${encodeURIComponent(firstname)}&type=${registrationType}`, baseUrl)
    )
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
