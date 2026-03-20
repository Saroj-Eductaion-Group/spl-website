import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = user.emailAddresses?.[0]?.emailAddress
  if (!email) return NextResponse.json({ registration: null })

  try {
    const dbUser = await prisma.user.findUnique({ where: { email } })
    if (!dbUser) return NextResponse.json({ registration: null })

    // Check team registration first
    const team = await prisma.team.findFirst({
      where: { createdById: dbUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { players: true } },
        payments: { select: { status: true, transactionId: true, amount: true } },
        players: { select: { id: true, name: true, role: true, phone: true, district: true, schoolCollege: true, isIndividual: true }, orderBy: { createdAt: 'asc' } }
      }
    })

    if (team) {
      return NextResponse.json({
        registration: {
          type: 'team',
          registrationId: team.registrationId,
          name: team.name,
          district: team.district,
          status: team.status,
          playerCount: team._count.players,
          players: team.players,
          payment: team.payments[0] || null,
          createdAt: team.createdAt
        }
      })
    }

    // Check individual registration
    const player = await prisma.player.findFirst({
      where: { createdById: dbUser.id, isIndividual: true },
      orderBy: { createdAt: 'desc' },
      include: {
        team: {
          select: {
            name: true, district: true, schoolCollege: true,
            managerName: true, managerPhone: true,
            coachName: true, coachPhone: true,
            contactEmail: true, registrationId: true
          }
        }
      }
    })

    if (player) {
      return NextResponse.json({
        registration: {
          type: 'individual',
          registrationId: player.registrationId,
          name: player.name,
          district: player.district,
          role: player.role,
          teamAssigned: player.teamAssigned,
          assignedTeam: player.team || null,
          createdAt: player.createdAt
        }
      })
    }

    return NextResponse.json({ registration: null })
  } catch (error) {
    console.error('My registration error:', error)
    return NextResponse.json({ error: 'Failed to fetch registration' }, { status: 500 })
  }
}
