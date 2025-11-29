import pool from './db';
import { auth } from '@clerk/nextjs/server';

const DAILY_CONTACT_LIMIT = 50;

/**
 * Get the number of contacts viewed today by the user
 */
export async function getViewedCount(userId: string): Promise<number> {
    const [rows] = await pool.query(
        `SELECT COUNT(*) as count
         FROM user_contact_views 
         WHERE user_id = ? 
         AND DATE(viewed_at) = CURDATE()`,
        [userId]
    );
    return (rows as any)[0].count;
}

/**
 * Get the number of remaining contact views for today
 */
export async function getRemainingViews(userId: string): Promise<number> {
    const count = await getViewedCount(userId);
    return Math.max(0, DAILY_CONTACT_LIMIT - count);
}

/**
 * Log multiple contact views at once (Bulk Log)
 * Returns the number of NEW contacts logged
 */
export async function logContactViews(userId: string, contactIds: string[]): Promise<number> {
    if (contactIds.length === 0) return 0;

    // We use INSERT IGNORE to handle duplicates (if user already viewed this contact today)
    // The UNIQUE KEY (user_id, contact_id, DATE(viewed_at)) ensures no double counting
    
    const values = contactIds.map(id => [userId, id]);
    
    const [result] = await pool.query(
        `INSERT IGNORE INTO user_contact_views (user_id, contact_id) VALUES ?`,
        [values]
    );

    return (result as any).affectedRows;
}

/**
 * Check if user can view a specific number of contacts
 */
export async function canViewContacts(userId: string, count: number): Promise<boolean> {
    const viewed = await getViewedCount(userId);
    return (viewed + count) <= DAILY_CONTACT_LIMIT;
}

/**
 * Get the current authenticated user's ID
 */
export async function getCurrentUserId(): Promise<string | null> {
    const { userId } = await auth();
    return userId;
}
