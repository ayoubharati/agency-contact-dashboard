import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getContacts, getTotalContactsCount } from '@/lib/data-access';
import { getRemainingViews, getViewedCount, logContactViews, canViewContacts } from '@/lib/contact-limit';

export async function GET(request: Request) {
    try {
        // Check authentication
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse query params
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        // 1. Check if user has enough views remaining for the requested amount
        // Note: This is a "soft" check. We might return fewer contacts if they hit the limit mid-way.
        const remaining = await getRemainingViews(userId);
        
        if (remaining === 0) {
             return NextResponse.json({
                success: false,
                limitReached: true,
                data: [],
                total: 0,
                remaining: 0,
                viewedCount: 50
            });
        }

        // 2. Fetch contacts from database
        // We fetch what they asked for, but we might trim it later
        const contacts = await getContacts(limit, offset);
        const totalContacts = await getTotalContactsCount();

        // 3. Determine how many we can actually show them
        // If they have 5 remaining, but asked for 20, we only give them 5.
        const contactsToShow = contacts.slice(0, remaining);
        const limitReached = contacts.length > remaining;

        // 4. Log the views (Bulk Log)
        // This is safe because of INSERT IGNORE in the backend. 
        // If they refresh the page, these IDs are already logged, so count won't increase.
        if (contactsToShow.length > 0) {
            const contactIds = contactsToShow.map(c => c.id);
            await logContactViews(userId, contactIds);
        }

        // 5. Get updated stats after logging
        const newViewedCount = await getViewedCount(userId);
        const newRemaining = await getRemainingViews(userId);

        return NextResponse.json({
            success: true,
            data: contactsToShow,
            total: totalContacts,
            remaining: newRemaining,
            viewedCount: newViewedCount,
            limitReached: limitReached || newRemaining === 0
        });

    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
}
