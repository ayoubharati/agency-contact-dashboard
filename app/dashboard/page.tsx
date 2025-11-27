import { auth, currentUser } from '@clerk/nextjs/server';
import { getRemainingViews, getViewedCount } from '@/lib/contact-limit';
import { getAgencies, getContacts } from '@/lib/data-access';
import Link from 'next/link';

export default async function DashboardPage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        return null;
    }

    // Get stats from database
    const agencies = await getAgencies();
    const contacts = await getContacts();
    const remainingViews = await getRemainingViews(userId);
    const viewedToday = await getViewedCount(userId);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white border border-gray-200 rounded p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    Welcome back, {user?.firstName || 'User'}
                </h1>
                <p className="text-sm text-gray-600">
                    Dashboard overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Agencies */}
                <div className="bg-white border border-gray-200 rounded p-5">
                    <div className="text-sm font-medium text-gray-600 mb-1">Total Agencies</div>
                    <div className="text-3xl font-semibold text-gray-900">{agencies.length.toLocaleString()}</div>
                </div>

                {/* Contacts Viewed Today */}
                <div className="bg-white border border-gray-200 rounded p-5">
                    <div className="text-sm font-medium text-gray-600 mb-1">Contacts Viewed Today</div>
                    <div className="text-3xl font-semibold text-gray-900">{viewedToday}</div>
                </div>

                {/* Remaining Views */}
                <div className="bg-white border border-gray-200 rounded p-5">
                    <div className="text-sm font-medium text-gray-600 mb-1">Remaining Views</div>
                    <div className="text-3xl font-semibold text-gray-900">{remainingViews}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href="/dashboard/agencies"
                    className="bg-white border border-gray-200 rounded p-6 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                    <h3 className="text-base font-semibold text-gray-900 mb-2">View Agencies</h3>
                    <p className="text-sm text-gray-600">
                        Browse all {agencies.length.toLocaleString()} agencies with detailed information
                    </p>
                </Link>

                <Link
                    href="/dashboard/contacts"
                    className="bg-white border border-gray-200 rounded p-6 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                    <h3 className="text-base font-semibold text-gray-900 mb-2">View Contacts</h3>
                    <p className="text-sm text-gray-600">
                        Access employee contacts ({remainingViews} views remaining today)
                    </p>
                </Link>
            </div>
        </div>
    );
}
