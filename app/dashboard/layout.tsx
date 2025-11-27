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
        <div className="min-h-screen bg-gray-50">
            {/* Header - AWS Console Style */}
            <header className="bg-gray-900 text-white border-t-2 border-blue-400">
                <div className="flex items-center h-10 px-4">
                    {/* Logo Section */}
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="text-sm font-medium">Agency Dashboard</span>
                    </Link>

                    {/* Right Section - Navigation and User */}
                    <div className="flex items-center ml-auto space-x-6">
                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/dashboard"
                                className="text-xs text-gray-300 hover:text-white px-2 py-1"
                            >
                                Home
                            </Link>
                            <Link
                                href="/dashboard/agencies"
                                className="text-xs text-gray-300 hover:text-white px-2 py-1"
                            >
                                Agencies
                            </Link>
                            <Link
                                href="/dashboard/contacts"
                                className="text-xs text-gray-300 hover:text-white px-2 py-1"
                            >
                                Contacts
                            </Link>
                        </nav>

                        {/* User Section */}
                        <div className="flex items-center space-x-2 ml-10">
                            <span className="text-xs text-gray-300">
                                {user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}
                            </span>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-7 h-7',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className="md:hidden bg-white border-b border-gray-200">
                <div className="px-4 py-2 flex space-x-4">
                    <Link
                        href="/dashboard"
                        className="text-xs text-gray-700 hover:text-gray-900"
                    >
                        Home
                    </Link>
                    <Link
                        href="/dashboard/agencies"
                        className="text-xs text-gray-700 hover:text-gray-900"
                    >
                        Agencies
                    </Link>
                    <Link
                        href="/dashboard/contacts"
                        className="text-xs text-gray-700 hover:text-gray-900"
                    >
                        Contacts
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-6">
                {children}
            </main>
        </div>
    );
}
