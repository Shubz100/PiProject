import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json()
        console.log('Received user data:', userData); // Debug log

        if (!userData || !userData.id) {
            console.log('Invalid user data received:', userData); // Debug log
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
        }

        try {
            let user = await prisma.user.findUnique({
                where: { telegramId: userData.id }
            })

            console.log('Existing user:', user); // Debug log

            if (!user) {
                console.log('Creating new user with data:', { // Debug log
                    telegramId: userData.id,
                    username: userData.username || '',
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || ''
                });

                user = await prisma.user.create({
                    data: {
                        telegramId: userData.id,
                        username: userData.username || '',
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || ''
                    }
                })
            }

            console.log('Returning user:', user); // Debug log
            return NextResponse.json(user)
        } catch (dbError) {
            console.error('Database operation failed:', dbError); // Debug log
            return NextResponse.json({ error: 'Database operation failed' }, { status: 500 })
        }
    } catch (error) {
        console.error('Error processing user data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
