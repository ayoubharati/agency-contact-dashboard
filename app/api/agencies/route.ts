import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAgencies, getTotalAgenciesCount } from '@/lib/data-access';

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

        // Fetch agencies from database
        const agencies = await getAgencies(limit, offset);
        const total = await getTotalAgenciesCount();

        return NextResponse.json({
            success: true,
            data: agencies,
            total: total,
        });
    } catch (error) {
        console.error('Error fetching agencies:', error);
        return NextResponse.json(
            { error: 'Failed to fetch agencies' },
            { status: 500 }
        );
    }
}
