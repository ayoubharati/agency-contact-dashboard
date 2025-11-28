import { NextResponse } from 'next/server';

export async function GET() {
    try {
        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            app: 'agency-contact-dashboard',
            version: '1.0.0',
            node_version: process.version,
            platform: process.platform,
            uptime: process.uptime(),
        }, { status: 200 });
    } catch (error) {
        console.error('Health check error:', error);

        return NextResponse.json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
