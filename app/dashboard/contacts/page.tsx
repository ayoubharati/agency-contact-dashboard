'use client';

import { useState, useEffect } from 'react';
import type { Contact } from '@/lib/csv-parser';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingViews, setRemainingViews] = useState<number | null>(null);
    const [viewedCount, setViewedCount] = useState<number>(0);
    const [viewedContactIds, setViewedContactIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = contacts.filter(contact =>
                `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredContacts(filtered);
        } else {
            setFilteredContacts(contacts);
        }
        setCurrentPage(1);
    }, [searchTerm, contacts]);

    async function fetchContacts() {
        try {
            setLoading(true);
            const response = await fetch('/api/contacts');

            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }

            const result = await response.json();
            setContacts(result.data);
            setFilteredContacts(result.data);
            setRemainingViews(result.remaining);
            setViewedCount(result.viewedCount || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function trackContactView(contactId: string) {
        // If already tracked in this session, skip
        if (viewedContactIds.has(contactId)) {
            return;
        }

        try {
            const response = await fetch('/api/contacts/view', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contactId }),
            });

            if (response.status === 403) {
                // Limit exceeded, refresh to show upgrade prompt
                window.location.reload();
                return;
            }

            if (response.ok) {
                const result = await response.json();

                // Update local state
                setViewedContactIds(prev => new Set([...prev, contactId]));

                if (!result.alreadyViewed) {
                    setViewedCount(result.viewedCount);
                    setRemainingViews(50 - result.viewedCount);
                }
            }
        } catch (err) {
            console.error('Error tracking contact view:', err);
        }
    }

    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentContacts = filteredContacts.slice(startIndex, endIndex);

    // Track views when contacts are displayed
    useEffect(() => {
        if (currentContacts.length > 0 && remainingViews !== null && remainingViews > 0) {
            currentContacts.forEach(contact => {
                trackContactView(contact.id);
            });
        }
    }, [currentContacts, remainingViews]);

    if (loading) {
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

    // Show upgrade prompt if no remaining views
    if (remainingViews === 0) {
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
                        You have {remainingViews} contact view{remainingViews !== 1 ? 's' : ''} remaining today. Each contact you view on this page counts toward your daily limit.
                    </p>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white border border-gray-200 rounded p-4">
                <input
                    type="text"
                    placeholder="Search by name, email, title, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                    <p className="text-xs text-gray-600 mt-2">
                        {filteredContacts.length} result{filteredContacts.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Title</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Department</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentContacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {contact.first_name} {contact.last_name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {contact.email ? (
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {contact.email}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{contact.phone || '-'}</td>
                                    <td className="px-4 py-3 text-gray-700">{contact.title || '-'}</td>
                                    <td className="px-4 py-3 text-gray-700">{contact.department || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
                        <div className="text-gray-600">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredContacts.length)} of{' '}
                            {filteredContacts.length}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
