import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getContacts } from '@/lib/data-access';
import { getRemainingViews, getViewedCount } from '@/lib/contact-limit';

export async function GET() {
    try {
        // Check authentication
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get current stats
        const remaining = await getRemainingViews(userId);
        const viewedCount = await getViewedCount(userId);

        // Fetch contacts from database
        const contacts = await getContacts();

        return NextResponse.json({
            success: true,
            data: contacts,
            total: contacts.length,
            remaining: remaining,
            viewedCount: viewedCount,
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}
