import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getRemainingViews, getViewedCount } from '@/lib/contact-limit';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const remaining = await getRemainingViews(userId);
        const viewedCount = await getViewedCount(userId);

        return NextResponse.json({
            remaining,
            viewedCount
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}