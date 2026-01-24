'use client';

import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    initialQuery?: string;
    onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', onSearch }) => {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const urlQuery = urlParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery || urlQuery || '');

    const handleSearch = () => {
        if (!query.trim()) return;

        if (onSearch) {
            // If onSearch callback is provided, use it (for search results page)
            onSearch(query);
            // Also update the URL query parameter
            router.get(`/hvk-chowk/question/search?q=${encodeURIComponent(query)}`);
        } else {
            // Navigate to search page (for main page)
            router.get(`/hvk-chowk/question/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="z-10 flex justify-center border-0 border-none px-3 py-4 shadow-xl">
            <div className="relative container mx-auto w-full lg:max-w-xl">
                <input
                    type="text"
                    placeholder="Search routes, highways, or destinations..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full rounded-full border border-gray-300 bg-white py-3 pr-10 pl-6 text-gray-700 placeholder-gray-400 shadow-sm focus:border-primary focus:ring-primary focus:outline-none"
                />
                <FaSearch
                    className="absolute top-1/2 right-4 -translate-y-1/2 transform cursor-pointer text-gray-400 transition-colors hover:text-primary"
                    onClick={handleSearch}
                />
            </div>
        </div>
    );
};

export default SearchBar;
