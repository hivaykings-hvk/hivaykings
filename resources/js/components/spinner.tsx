import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-yellow-500" />
                <p className="mt-2 text-gray-600">Loading...</p>
            </div>
        </div>
    );
}
