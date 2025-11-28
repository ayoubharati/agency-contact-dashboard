import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        ok: true,
        message: "Hello from API",
        env_check: {
            has_host: !!process.env.DB_HOST,
            has_user: !!process.env.DB_USER,
            has_pass: !!process.env.DB_PASSWORD
        }
    });
}
