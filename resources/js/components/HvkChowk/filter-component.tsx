import { FaFilter, FaSort } from 'react-icons/fa';

const FilterComponent = () => {
    return (
        <div className="m-6 mx-auto flex items-center justify-center space-x-1 rounded-lg border-2 border-white bg-white p-4 shadow-lg">
            <div className="flex items-center space-x-1">
                <FaFilter className="h-5 w-5 text-primary" />
                <span className="hidden font-medium text-gray-700 md:inline">Filters:</span>
            </div>
            <select className="rounded-md border border-gray-300 px-1 py-2 text-sm">
                <option>Categories</option>
                {/* Add more category options here */}
            </select>
            <select className="rounded-md border border-gray-300 px-1 py-2 text-sm">
                <option>Regions</option>
                {/* Add more region options here */}
            </select>

            <div className="ml-auto flex items-center space-x-1">
                <FaSort className="h-5 w-5 text-primary" />
                <span className="hidden font-medium text-gray-700 md:inline">Sort:</span>
            </div>
            <select className="rounded-md border border-gray-300 px-1 py-2 text-sm">
                <option>Hot</option>
                {/* Add more sort options here */}
            </select>
        </div>
    );
};

export default FilterComponent;
