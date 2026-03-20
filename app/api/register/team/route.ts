import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRegistrationEmail } from '@/lib/email'
import { sendRegistrationSMS } from '@/lib/sms'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const registrationId = `SPL${nanoid(8).toUpperCase()}`

    // Get or create DB user — prefer Clerk session, fallback to email
    const clerkUser = await currentUser()
    const email = (clerkUser?.emailAddresses?.[0]?.emailAddress || data.email)?.toLowerCase()

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    let dbUser = await prisma.user.findUnique({ where: { email } })
    if (!dbUser) {
      const tempPassword = await bcrypt.hash(nanoid(16), 10)
      dbUser = await prisma.user.create({
        data: { email, password: tempPassword, role: 'PUBLIC', name: clerkUser?.firstName || data.managerName || null }
      })
    }

    const team = await prisma.team.create({
      data: {
        name: data.teamName,
        district: data.district,
        schoolCollege: data.schoolCollege,
        coachName: data.coachName || null,
        coachPhone: data.coachPhone || null,
        managerName: data.managerName || null,
        managerPhone: data.managerPhone || null,
        contactEmail: email,
        contactPhone: data.managerPhone || data.coachPhone || null,
        registrationId,
        createdById: dbUser.id
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
            aadhaarDoc: playerData.aadhaarDoc || null,
            schoolIdDoc: playerData.schoolIdDoc || null,
            dobProofDoc: playerData.dobProofDoc || null,
            photoDoc: playerData.photoDoc || null,
            teamId: team.id,
            createdById: team.createdById
          }
        })
      }
    }

    await prisma.payment.create({ data: { amount: 11000, teamId: team.id, status: 'PENDING' } })

    try { if (email) await sendRegistrationEmail(email, registrationId, data.teamName) } catch { }
    try {
      const phone = data.managerPhone || data.coachPhone || ''
      if (phone) await sendRegistrationSMS(phone, registrationId, data.teamName, true)
    } catch { }

    return NextResponse.json({ success: true, teamId: team.id, registrationId, amount: 11000 })
  } catch (error) {
    console.error('Team registration error')
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
