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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/dashboard/agencies"
                    className="group relative bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-8 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold">View Agencies</h3>
                            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                        <p className="text-blue-100">
                            Browse all {agencies.length.toLocaleString()} agencies with detailed information
                        </p>
                    </div>
                </Link>

                <Link
                    href="/dashboard/contacts"
                    className="group relative bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-lg p-8 hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold">View Contacts</h3>
                            <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                        <p className="text-indigo-100">
                            Access employee contacts ({remainingViews} views remaining today)
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
