import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header - Professional Style */}
            <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg border-b border-slate-700">
                <div className="flex items-center h-14 px-6">
                    {/* Logo Section */}
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-base">A</span>
                        </div>
                        <span className="text-base font-semibold tracking-tight group-hover:text-blue-300 transition-colors">Agency Dashboard</span>
                    </Link>

                    {/* Right Section - Navigation and User */}
                    <div className="flex items-center ml-auto space-x-8">
                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-1">
                            <Link
                                href="/dashboard"
                                className="text-sm text-slate-200 hover:text-white hover:bg-slate-700/50 px-4 py-2 rounded transition-all"
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard/agencies"
                                className="text-sm text-slate-200 hover:text-white hover:bg-slate-700/50 px-4 py-2 rounded transition-all"
                            >
                                Agencies
                            </Link>
                            <Link
                                href="/dashboard/contacts"
                                className="text-sm text-slate-200 hover:text-white hover:bg-slate-700/50 px-4 py-2 rounded transition-all"
                            >
                                Contacts
                            </Link>
                        </nav>

                        {/* User Section */}
                        <div className="flex items-center space-x-3 pl-4 border-l border-slate-700">
                            <span className="text-sm text-slate-300 hidden sm:block">
                                {user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}
                            </span>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-8 h-8 ring-2 ring-slate-600 hover:ring-blue-500 transition-all',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className="md:hidden bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="px-4 py-3 flex space-x-1">
                    <Link
                        href="/dashboard"
                        className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded transition-all"
                    >
                        Home
                    </Link>
                    <Link
                        href="/dashboard/agencies"
                        className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded transition-all"
                    >
                        Agencies
                    </Link>
                    <Link
                        href="/dashboard/contacts"
                        className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded transition-all"
                    >
                        Contacts
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
