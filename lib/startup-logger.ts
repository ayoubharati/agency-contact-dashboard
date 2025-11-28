/**
 * Startup Logger - Logs environment variables and configuration on server startup
 * This helps diagnose environment variable issues in deployed environments like AWS Amplify
 */

export function logStartupInfo() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 SERVER STARTUP - Environment Check');
    console.log('='.repeat(80));

    console.log('\n📅 Timestamp:', new Date().toISOString());
    console.log('🖥️  Platform:', process.platform);
    console.log('📦 Node Version:', process.version);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

    console.log('\n' + '-'.repeat(80));
    console.log('🔐 DATABASE ENVIRONMENT VARIABLES');
    console.log('-'.repeat(80));

    const dbEnvVars = {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD ? `***${process.env.DB_PASSWORD.substring(process.env.DB_PASSWORD.length - 4)}` : undefined,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
    };

    // Check each variable
    Object.entries(dbEnvVars).forEach(([key, value]) => {
        const status = value ? '✅' : '❌';
        const displayValue = value || 'NOT SET';
        console.log(`${status} ${key.padEnd(20)} = ${displayValue}`);
    });

    // Count how many are set
    const setCount = Object.values(dbEnvVars).filter(v => v).length;
    const totalCount = Object.keys(dbEnvVars).length;

    console.log('\n' + '-'.repeat(80));
    console.log(`📊 Summary: ${setCount}/${totalCount} database variables are set`);

    if (setCount < totalCount) {
        console.log('⚠️  WARNING: Some database environment variables are missing!');
        console.log('   This will cause database connection failures.');
    } else {
        console.log('✅ All required database environment variables are set!');
    }

    console.log('\n' + '-'.repeat(80));
    console.log('🔍 ALL ENVIRONMENT VARIABLES (keys only)');
    console.log('-'.repeat(80));

    // Log all environment variable keys
    const allEnvKeys = Object.keys(process.env).sort();
    console.log('Total environment variables:', allEnvKeys.length);

    // Group by prefix
    const dbKeys = allEnvKeys.filter(k => k.startsWith('DB_'));
    const clerkKeys = allEnvKeys.filter(k => k.startsWith('CLERK_') || k.startsWith('NEXT_PUBLIC_CLERK_'));
    const nextKeys = allEnvKeys.filter(k => k.startsWith('NEXT_') && !k.startsWith('NEXT_PUBLIC_CLERK_'));
    const awsKeys = allEnvKeys.filter(k => k.startsWith('AWS_'));

    if (dbKeys.length > 0) {
        console.log('\n🗄️  Database vars:', dbKeys.join(', '));
    }
    if (clerkKeys.length > 0) {
        console.log('🔐 Clerk vars:', clerkKeys.join(', '));
    }
    if (nextKeys.length > 0) {
        console.log('⚡ Next.js vars:', nextKeys.join(', '));
    }
    if (awsKeys.length > 0) {
        console.log('☁️  AWS vars:', awsKeys.join(', '));
    }

    console.log('\n' + '='.repeat(80));
    console.log('✨ Startup logging complete');
    console.log('='.repeat(80) + '\n');
}

// Auto-run on module load
if (typeof window === 'undefined') {
    // Only run on server-side
    logStartupInfo();
}
