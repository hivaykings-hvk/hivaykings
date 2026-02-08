'use client';

import { FaSort } from 'react-icons/fa';
import { useSort } from './sort-context';

const FilterComponent = () => {
    const { sort, setSort } = useSort();

    return (
        <div className="m-6 mx-auto flex items-center justify-center space-x-3 rounded-lg border-2 border-white bg-white p-4 shadow-lg">
            <div className="flex items-center space-x-2">
                <FaSort className="h-5 w-5 text-primary" />
                <span className="hidden font-medium text-gray-700 md:inline">Sort:</span>
            </div>
            <select
                value={sort}
                onChange={(e) => setSort(e.target.value as 'trending' | 'latest')}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none"
            >
                <option value="trending">Trending</option>
                <option value="latest">Latest</option>
            </select>
        </div>
    );
};

export default FilterComponent;
