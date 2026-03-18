import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRegistrationEmail } from '@/lib/email'
import { sendRegistrationSMS } from '@/lib/sms'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const registrationId = `SPL${nanoid(8).toUpperCase()}`

    const team = await prisma.team.create({
      data: {
        name: data.teamName,
        district: data.district,
        schoolCollege: data.schoolCollege,
        coachName: data.coachName || null,
        coachPhone: data.coachPhone || null,
        managerName: data.managerName || null,
        managerPhone: data.managerPhone || null,
        contactEmail: data.email || null,
        contactPhone: data.managerPhone || data.coachPhone || null,
        registrationId,
        createdBy: {
          create: {
            email: data.email || `team_${registrationId}@spl.com`,
            password: 'temp',
            role: 'PUBLIC'
          }
        }
      }
    })

    for (const playerData of (data.players || [])) {
      if (playerData.name && playerData.dateOfBirth && playerData.phone && playerData.aadhaarNo) {
        await prisma.player.create({
          data: {
            name: playerData.name,
            dateOfBirth: new Date(playerData.dateOfBirth),
            phone: playerData.phone,
            aadhaarNo: playerData.aadhaarNo,
            schoolCollege: data.schoolCollege,
            district: data.district,
            role: playerData.role || 'BATSMAN',
            teamId: team.id,
            createdById: team.createdById
          }
        })
      }
    }

    await prisma.payment.create({
      data: { amount: 11000, teamId: team.id, status: 'PENDING' }
    })

    try {
      if (data.email) await sendRegistrationEmail(data.email, registrationId, data.teamName)
    } catch (e) { console.error('Email failed:', e) }
    try {
      const phone = data.managerPhone || data.coachPhone || ''
      if (phone) await sendRegistrationSMS(phone, registrationId, data.teamName, true)
    } catch (e) { console.error('SMS failed:', e) }

    return NextResponse.json({
      success: true,
      teamId: team.id,
      registrationId,
      amount: 11000,
      email: data.email,
      phone: data.managerPhone || data.coachPhone || '',
      name: data.teamName
    })
  } catch (error) {
    console.error('Team registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
