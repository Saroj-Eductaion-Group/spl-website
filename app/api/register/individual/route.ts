import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { sendRegistrationEmail } from '@/lib/email'
import { sendRegistrationSMS } from '@/lib/sms'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const registrationId = `SPL${nanoid(8).toUpperCase()}`
    const tempPassword = await bcrypt.hash(nanoid(16), 10)

    const existingUser = await prisma.user.findUnique({ where: { email: data.email?.toLowerCase() } })

    const user = existingUser ?? await prisma.user.create({
      data: {
        email: data.email?.toLowerCase() || `player_${nanoid(8)}@spl.com`,
        password: tempPassword,
        role: 'PUBLIC',
        name: data.name,
        phone: data.phone,
        district: data.district
      }
    })

    const player = await prisma.player.create({
      data: {
        name: data.name,
        fatherName: data.fatherName,
        dateOfBirth: new Date(data.dateOfBirth),
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        aadhaarNo: data.aadhaarNo || '',
        schoolCollege: data.schoolCollege,
        district: data.district,
        role: data.role,
        position: data.position,
        experience: data.experience,
        aadhaarDoc: data.aadhaarDoc,
        schoolIdDoc: data.schoolIdDoc,
        dobProofDoc: data.dobProofDoc,
        photoDoc: data.photoDoc,
        isIndividual: true,
        teamAssigned: false,
        registrationId,
        createdById: user.id
      }
    })

    await prisma.payment.create({ data: { amount: 1000, playerId: player.id, status: 'PENDING' } })

    try { if (data.email) await sendRegistrationEmail(data.email, registrationId, undefined, data.name) } catch { }
    try { if (data.phone) await sendRegistrationSMS(data.phone, registrationId, data.name, false) } catch { }

    return NextResponse.json({ success: true, playerId: player.id, registrationId, amount: 1000 })
  } catch (error) {
    console.error('Individual registration error')
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
