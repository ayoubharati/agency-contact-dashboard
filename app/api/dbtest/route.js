import { NextResponse } from 'next/server';
import { logStartupInfo } from '@/lib/startup-logger';

export async function GET() {
    // Log environment variables for debugging
    console.log('\n🔍 /api/dbtest called - Logging environment variables:');
    logStartupInfo();

    try {
        // Get environment variables
        const envVars = {
            DB_HOST: process.env.DB_HOST || 'NOT_SET',
            DB_USER: process.env.DB_USER || 'NOT_SET',
            DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT_SET',
            DB_NAME: process.env.DB_NAME || 'NOT_SET',
            DB_PORT: process.env.DB_PORT || 'NOT_SET',
            NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
        };

        // Check which env vars are set
        const envCheck = {
            has_host: !!process.env.DB_HOST,
            has_user: !!process.env.DB_USER,
            has_password: !!process.env.DB_PASSWORD,
            has_db_name: !!process.env.DB_NAME,
            has_port: !!process.env.DB_PORT,
        };

        console.log('Environment Check:', envCheck);
        console.log('DB_HOST value:', envVars.DB_HOST);

        return NextResponse.json({
            ok: true,
            message: "API endpoint is working!",
            timestamp: new Date().toISOString(),
            env_check: envCheck,
            env_vars: envVars,
            all_env_keys: Object.keys(process.env).filter(key =>
                key.startsWith('DB_') || key.startsWith('NEXT_')
            ),
        }, { status: 200 });

    } catch (error) {
        console.error('Error in /api/dbtest:', error);

        return NextResponse.json({
            ok: false,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
