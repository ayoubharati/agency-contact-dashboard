import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAgencies } from '@/lib/data-access';

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

        // Fetch agencies from database
        const agencies = await getAgencies();

        return NextResponse.json({
            success: true,
            data: agencies,
            total: agencies.length,
        });
    } catch (error) {
        console.error('Error fetching agencies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch agencies' },
            { status: 500 }
        );
    }
}
