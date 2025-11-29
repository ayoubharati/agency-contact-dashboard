'use client';

import { useState, useEffect } from 'react';
import type { Agency } from '@/lib/data-access';

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAgencies, setTotalAgencies] = useState(0);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchAgencies(currentPage);
    }, [currentPage]);

    async function fetchAgencies(page: number) {
        try {
            setLoading(true);

            // Check session storage first
            const cacheKey = `agencies_page_${page}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                const result = JSON.parse(cachedData);
                setAgencies(result.data);
                setTotalAgencies(result.total);
                if (result.data.length > 0) {
                    setColumns(Object.keys(result.data[0]));
                }
                setLoading(false);
                return;
            }

            const response = await fetch(`/api/agencies?page=${page}&limit=${itemsPerPage}`);

            if (!response.ok) {
                throw new Error('Failed to fetch agencies');
            }

            const result = await response.json();

            // Save to session storage
            sessionStorage.setItem(cacheKey, JSON.stringify(result));

            setAgencies(result.data);
            setTotalAgencies(result.total);

            if (result.data.length > 0) {
                setColumns(Object.keys(result.data[0]));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(totalAgencies / itemsPerPage);

    const formatHeader = (key: string) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderCell = (item: any, key: string) => {
        const value = item[key];
        if (value === null || value === undefined || value === '') return '-';

        if (key === 'website' && typeof value === 'string' && value.startsWith('http')) {
            return (
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Visit
                </a>
            );
        }

        if ((key === 'population' || key === 'total_students' || key === 'total_schools') && !isNaN(Number(value))) {
            return parseInt(value).toLocaleString();
        }

        return String(value);
    };

    if (loading && agencies.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-sm text-gray-600">Loading agencies...</div>
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

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Agencies</h1>
                <p className="text-sm text-gray-600">
                    {totalAgencies.toLocaleString()} total agencies
                </p>
            </div>

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
                            {agencies.map((agency) => (
                                <tr key={agency.id} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={`${agency.id}-${col}`} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                            {renderCell(agency, col)}
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
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalAgencies)} of{' '}
                        {totalAgencies.toLocaleString()}
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
                            disabled={currentPage >= totalPages || loading}
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
        </div>
    );
}
