import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const startTime = Date.now();

    try {
        console.log('=== DB Connection Test Started ===');
        console.log('Environment variables check:');
        console.log('DB_HOST:', process.env.DB_HOST ? 'SET' : 'NOT SET');
        console.log('DB_USER:', process.env.DB_USER ? 'SET' : 'NOT SET');
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
        console.log('DB_NAME:', process.env.DB_NAME ? 'SET' : 'NOT SET');
        console.log('DB_PORT:', process.env.DB_PORT || '3306 (default)');

        // Try to get a connection from the pool
        console.log('Attempting to get connection from pool...');
        const connection = await pool.getConnection();
        console.log('✓ Connection obtained from pool');

        // Try a simple query
        console.log('Attempting to run test query...');
        const [rows] = await connection.query('SELECT 1 as test');
        console.log('✓ Test query executed successfully');

        // Release the connection back to the pool
        connection.release();
        console.log('✓ Connection released');

        const duration = Date.now() - startTime;
        console.log(`=== DB Connection Test Completed in ${duration}ms ===`);

        return NextResponse.json({
            ok: true,
            message: 'Database connection successful!',
            timestamp: new Date().toISOString(),
            duration_ms: duration,
            test_query_result: rows,
            connection_info: {
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT || '3306',
                user: process.env.DB_USER,
            },
        }, { status: 200 });

    } catch (error) {
        const duration = Date.now() - startTime;

        console.error('=== DB Connection Test FAILED ===');
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
        });

        return NextResponse.json({
            ok: false,
            message: 'Database connection failed',
            timestamp: new Date().toISOString(),
            duration_ms: duration,
            error: {
                message: error.message,
                code: error.code,
                errno: error.errno,
                sqlState: error.sqlState,
                sqlMessage: error.sqlMessage,
            },
            connection_info: {
                host: process.env.DB_HOST || 'NOT_SET',
                database: process.env.DB_NAME || 'NOT_SET',
                port: process.env.DB_PORT || '3306',
                user: process.env.DB_USER || 'NOT_SET',
            },
            troubleshooting: {
                check_env_vars: 'Ensure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME are set in Amplify',
                check_security_group: 'Verify Aurora RDS security group allows inbound from 0.0.0.0/0',
                check_public_access: 'Ensure RDS instance has public accessibility enabled',
                check_credentials: 'Verify username and password are correct',
            },
        }, { status: 500 });
    }
}
