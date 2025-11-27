import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { addViewedContact, canViewMoreContacts, hasViewedContact } from '@/lib/contact-limit';

export async function POST(request: Request) {
    try {
        // Check authentication
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get contact ID from request body
        const { contactId } = await request.json();

        if (!contactId) {
            return NextResponse.json(
                { error: 'Contact ID is required' },
                { status: 400 }
            );
        }

        // Check if already viewed this contact
        const alreadyViewed = await hasViewedContact(userId, contactId);

        if (alreadyViewed) {
            // Already viewed, no need to increment
            return NextResponse.json({
                success: true,
                alreadyViewed: true,
                message: 'Contact already viewed today',
            });
        }

        // Check if can view more contacts
        const canView = await canViewMoreContacts(userId);

        if (!canView) {
            return NextResponse.json(
                {
                    error: 'Daily contact view limit exceeded',
                    limitExceeded: true,
                },
                { status: 403 }
            );
        }

        // Add contact to viewed list
        const newCount = await addViewedContact(userId, contactId);

        return NextResponse.json({
            success: true,
            viewedCount: newCount,
            alreadyViewed: false,
        });
    } catch (error) {
        console.error('Error tracking contact view:', error);
        return NextResponse.json(
            { error: 'Failed to track contact view' },
            { status: 500 }
        );
    }
}
