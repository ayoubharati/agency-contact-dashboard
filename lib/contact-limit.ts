import { auth, clerkClient } from '@clerk/nextjs/server';

const DAILY_CONTACT_LIMIT = 50;

interface ContactViewMetadata {
    viewedContactIds: string[];
    lastViewDate: string;
}

/**
 * Get the viewed contact IDs and last view date for a user
 */
export async function getViewedContacts(userId: string): Promise<ContactViewMetadata> {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const metadata = user.publicMetadata as any;

    return {
        viewedContactIds: metadata.viewedContactIds || [],
        lastViewDate: metadata.lastViewDate || '',
    };
}

/**
 * Check if the last view was on a different day (UTC)
 */
function isNewDay(lastViewDate: string): boolean {
    if (!lastViewDate) return true;

    const lastDate = new Date(lastViewDate);
    const today = new Date();

    // Compare dates in UTC
    const lastDateUTC = new Date(Date.UTC(
        lastDate.getUTCFullYear(),
        lastDate.getUTCMonth(),
        lastDate.getUTCDate()
    ));

    const todayUTC = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
    ));

    return lastDateUTC.getTime() !== todayUTC.getTime();
}

/**
 * Add a contact ID to the viewed list
 */
export async function addViewedContact(userId: string, contactId: string): Promise<number> {
    const client = await clerkClient();
    const { viewedContactIds, lastViewDate } = await getViewedContacts(userId);

    const today = new Date().toISOString();

    let newViewedIds: string[];

    if (isNewDay(lastViewDate)) {
        // Reset for new day
        newViewedIds = [contactId];
    } else {
        // Add to existing list if not already viewed
        if (!viewedContactIds.includes(contactId)) {
            newViewedIds = [...viewedContactIds, contactId];
        } else {
            // Already viewed this contact today
            newViewedIds = viewedContactIds;
        }
    }

    // Update user metadata
    await client.users.updateUser(userId, {
        publicMetadata: {
            viewedContactIds: newViewedIds,
            lastViewDate: today,
        },
    });

    return newViewedIds.length;
}

/**
 * Check if user has already viewed a specific contact today
 */
export async function hasViewedContact(userId: string, contactId: string): Promise<boolean> {
    const { viewedContactIds, lastViewDate } = await getViewedContacts(userId);

    // If it's a new day, they haven't viewed anything yet
    if (isNewDay(lastViewDate)) {
        return false;
    }

    return viewedContactIds.includes(contactId);
}

/**
 * Check if user can view more contacts today
 */
export async function canViewMoreContacts(userId: string): Promise<boolean> {
    const { viewedContactIds, lastViewDate } = await getViewedContacts(userId);

    // If it's a new day, they can view contacts
    if (isNewDay(lastViewDate)) {
        return true;
    }

    // Check if they're under the limit
    return viewedContactIds.length < DAILY_CONTACT_LIMIT;
}

/**
 * Get the number of remaining contact views for today
 */
export async function getRemainingViews(userId: string): Promise<number> {
    const { viewedContactIds, lastViewDate } = await getViewedContacts(userId);

    // If it's a new day, they have the full limit
    if (isNewDay(lastViewDate)) {
        return DAILY_CONTACT_LIMIT;
    }

    const remaining = DAILY_CONTACT_LIMIT - viewedContactIds.length;
    return Math.max(0, remaining);
}

/**
 * Get the number of contacts viewed today
 */
export async function getViewedCount(userId: string): Promise<number> {
    const { viewedContactIds, lastViewDate } = await getViewedContacts(userId);

    // If it's a new day, count is 0
    if (isNewDay(lastViewDate)) {
        return 0;
    }

    return viewedContactIds.length;
}

/**
 * Get the current authenticated user's ID
 */
export async function getCurrentUserId(): Promise<string | null> {
    const { userId } = await auth();
    return userId;
}
