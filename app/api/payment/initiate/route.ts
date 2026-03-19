import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const EASEBUZZ_KEY = process.env.EASEBUZZ_KEY || ''
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT || ''
const EASEBUZZ_ENV = process.env.EASEBUZZ_ENV || 'test'

export async function POST(request: NextRequest) {
  try {
    const { registrationId, amount, email, phone, name, registrationType, teamId, playerId } = await request.json()

    if (!registrationId || !amount || !email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const txnid = `SPL${Date.now()}`

    // Dev mode: no Easebuzz key configured
    if (!EASEBUZZ_KEY || EASEBUZZ_KEY === 'your-easebuzz-key') {
      if (teamId) {
        await prisma.payment.updateMany({
          where: { teamId },
          data: { status: 'COMPLETED', transactionId: txnid, paymentId: txnid }
        })
      }
      const successUrl = `/payment/success?registrationId=${registrationId}&txnid=${txnid}&name=${encodeURIComponent(name)}&type=${registrationType}`
      return NextResponse.json({ success: true, paymentUrl: successUrl })
    }

    const productinfo = `SPL-${registrationType === 'team' ? 'Team' : 'Individual'}-Registration`
    const hashString = `${EASEBUZZ_KEY}|${txnid}|${amount}|${productinfo}|${name}|${email}|||||||||||${EASEBUZZ_SALT}`
    const hash = crypto.createHash('sha512').update(hashString).digest('hex')

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const paymentData: Record<string, string> = {
      key: EASEBUZZ_KEY,
      txnid,
      amount: amount.toString(),
      productinfo,
      firstname: name,
      email,
      phone: phone || '',
      surl: `${baseUrl}/api/payment/success`,
      furl: `${baseUrl}/api/payment/failed`,
      hash,
      udf1: registrationId,
      udf2: registrationType,
      udf3: teamId || '',
      udf4: playerId || '',
    }

    const easebuzzUrl = EASEBUZZ_ENV === 'prod'
      ? 'https://pay.easebuzz.in/payment/initiateLink'
      : 'https://testpay.easebuzz.in/payment/initiateLink'

    const res = await fetch(easebuzzUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(paymentData).toString()
    })

    const data = await res.json()

    if (data.status === 1 && data.data) {
      const paymentUrl = EASEBUZZ_ENV === 'prod'
        ? `https://pay.easebuzz.in/pay/${data.data}`
        : `https://testpay.easebuzz.in/pay/${data.data}`
      return NextResponse.json({ success: true, paymentUrl })
    }

    return NextResponse.json({ error: data.error_desc || 'Payment initiation failed' }, { status: 400 })
  } catch (error) {
    console.error('Payment initiate error:', error)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
