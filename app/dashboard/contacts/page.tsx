'use client';

import { useState, useEffect } from 'react';
import type { Contact } from '@/lib/data-access';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingViews, setRemainingViews] = useState<number | null>(null);
    const [viewedCount, setViewedCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalContacts, setTotalContacts] = useState(0);
    const [limitReached, setLimitReached] = useState(false);

    const itemsPerPage = 20;

    useEffect(() => {
        fetchContacts(currentPage);
    }, [currentPage]);

    async function fetchContacts(page: number) {
        try {
            setLoading(true);

            // Check session storage first
            const cacheKey = `contacts_page_${page}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                const result = JSON.parse(cachedData);
                setContacts(result.data);
                if (result.data.length > 0) {
                    setColumns(Object.keys(result.data[0]));
                }
                setTotalContacts(result.total);

                // Even if we have cached data, we should fetch the latest stats
                // to ensure the "Remaining Views" counter is accurate.
                fetchUserStats();

                // We use the cached limitReached state initially, but the stats fetch might update it
                setLimitReached(result.limitReached);

                setLoading(false);
                return;
            }

            const response = await fetch(`/api/contacts?page=${page}&limit=${itemsPerPage}`);

            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }

            const result = await response.json();

            if (result.limitReached && result.data.length === 0) {
                setLimitReached(true);
                setRemainingViews(0);
                setViewedCount(50);
                return;
            }

            // Save to session storage
            sessionStorage.setItem(cacheKey, JSON.stringify(result));

            setContacts(result.data);
            if (result.data.length > 0) {
                setColumns(Object.keys(result.data[0]));
            }

            setTotalContacts(result.total);
            setRemainingViews(result.remaining);
            setViewedCount(result.viewedCount || 0);
            setLimitReached(result.limitReached);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(totalContacts / itemsPerPage);

    const formatHeader = (key: string) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderCell = (item: any, key: string) => {
        const value = item[key];
        if (value === null || value === undefined || value === '') return '-';

        if (key === 'email') {
            return (
                <a
                    href={`mailto:${value}`}
                    className="text-blue-600 hover:underline"
                >
                    {value}
                </a>
            );
        }

        return String(value);
    };

    if (loading && contacts.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-sm text-gray-600">Loading contacts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
                Error: {error}
            </div>
        );
    }

    // Show upgrade prompt if limit reached and no contacts to show
    if (limitReached && contacts.length === 0) {
        return (
            <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded p-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Contacts</h1>
                    <p className="text-sm text-gray-600">Employee contact information</p>
                </div>
                <UpgradePrompt />
            </div>
        );
    }

    async function fetchUserStats() {
        try {
            const response = await fetch('/api/user-stats');
            if (response.ok) {
                const stats = await response.json();
                setRemainingViews(stats.remaining);
                setViewedCount(stats.viewedCount);
                if (stats.remaining === 0) {
                    setLimitReached(true);
                }
            }
        } catch (err) {
            console.error('Failed to update user stats', err);
        }
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Contacts</h1>
                        <p className="text-sm text-gray-600">
                            Viewing {viewedCount} of 50 contacts today
                        </p>
                    </div>
                    {remainingViews !== null && (
                        <div className="text-right">
                            <div className="text-xs text-gray-600">Remaining views</div>
                            <div className="text-2xl font-semibold text-gray-900">{remainingViews}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Warning if low on views */}
            {remainingViews !== null && remainingViews <= 10 && remainingViews > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-sm text-yellow-800">
                        You have {remainingViews} contact view{remainingViews !== 1 ? 's' : ''} remaining today.
                    </p>
                </div>
            )}

            {/* Limit Reached Warning (Partial Data) */}
            {limitReached && contacts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                    <p className="text-sm text-red-800">
                        You have reached your daily limit. Upgrade to view more contacts.
                    </p>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col} className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                        {formatHeader(col)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {contacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={`${contact.id}-${col}`} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                            {renderCell(contact, col)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 px-4 py-4 border-t border-gray-200 flex items-center justify-between text-sm">
                    <div className="text-gray-600 font-medium">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalContacts)} of{' '}
                        {totalContacts.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loading}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all shadow-sm flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                        </button>
                        <span className="text-gray-700 font-medium px-3">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={
                                currentPage >= totalPages ||
                                loading ||
                                (limitReached && contacts.length === 0) ||
                                currentPage >= 3 // Hard limit: 50 contacts / 20 per page = 2.5 pages -> Max Page 3
                            }
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all shadow-sm flex items-center space-x-2"
                        >
                            <span>Next</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {limitReached && (
                <UpgradePrompt />
            )}
        </div>
    );
}
