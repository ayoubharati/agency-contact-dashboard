'use client';

import { useState, useEffect } from 'react';
import type { Agency } from '@/lib/csv-parser';

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchAgencies();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = agencies.filter(agency =>
                agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agency.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agency.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agency.county.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAgencies(filtered);
        } else {
            setFilteredAgencies(agencies);
        }
        setCurrentPage(1);
    }, [searchTerm, agencies]);

    async function fetchAgencies() {
        try {
            setLoading(true);
            const response = await fetch('/api/agencies');

            if (!response.ok) {
                throw new Error('Failed to fetch agencies');
            }

            const result = await response.json();
            setAgencies(result.data);
            setFilteredAgencies(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAgencies = filteredAgencies.slice(startIndex, endIndex);

    if (loading) {
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
                    {agencies.length.toLocaleString()} total agencies
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white border border-gray-200 rounded p-4">
                <input
                    type="text"
                    placeholder="Search by name, state, type, or county..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                    <p className="text-xs text-gray-600 mt-2">
                        {filteredAgencies.length} result{filteredAgencies.length !== 1 ? 's' : ''}
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
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">State</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Population</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Schools</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Students</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Website</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentAgencies.map((agency) => (
                                <tr key={agency.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{agency.name}</td>
                                    <td className="px-4 py-3 text-gray-700">{agency.state}</td>
                                    <td className="px-4 py-3 text-gray-700">{agency.type}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {agency.population ? parseInt(agency.population).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{agency.total_schools || '-'}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {agency.total_students ? parseInt(agency.total_students).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {agency.website ? (
                                            <a
                                                href={agency.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Visit
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
                        <div className="text-gray-600">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredAgencies.length)} of{' '}
                            {filteredAgencies.length}
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
