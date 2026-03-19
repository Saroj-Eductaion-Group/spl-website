import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { sendRegistrationEmail } from '@/lib/email'
import { sendRegistrationSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const registrationId = `SPL${nanoid(8).toUpperCase()}`
    
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    let user
    if (existingUser) {
      user = existingUser
    } else {
      user = await prisma.user.create({
        data: {
          email: data.email || `player_${nanoid(8)}@spl.com`,
          password: 'temp',
          role: 'PUBLIC',
          name: data.name,
          phone: data.phone,
          district: data.district
        }
      })
    }

    const player = await prisma.player.create({
      data: {
        name: data.name,
        fatherName: data.fatherName,
        dateOfBirth: new Date(data.dateOfBirth),
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        aadhaarNo: data.aadhaarNo || nanoid(12),
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

    try { if (data.email) await sendRegistrationEmail(data.email, registrationId, undefined, data.name) } catch (e) { console.error('Email failed:', e) }
    try { if (data.phone) await sendRegistrationSMS(data.phone, registrationId, data.name, false) } catch (e) { console.error('SMS failed:', e) }

    return NextResponse.json({ 
      success: true, 
      playerId: player.id,
      userId: user.id,
      registrationId,
      paymentRequired: true,
      amount: 1000,
      email: data.email,
      phone: data.phone,
      name: data.name
    })
  } catch (error) {
    console.error('Individual registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}