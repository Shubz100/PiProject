// app/api/user/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Find or create user
        const user = await prisma.user.upsert({
            where: {
                // Use appropriate unique identifier
                telegramId: body.telegramId || undefined,
            },
            update: {},
            create: {
                telegramId: body.telegramId,
                piAmount: 0,
                preMarketPrice: 0.65,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Request error', error);
        return NextResponse.json({ error: 'Error creating/fetching user' }, { status: 500 });
    }
}
