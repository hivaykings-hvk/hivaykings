import { cn } from '@/lib/utils';
import { CgSpinner } from 'react-icons/cg';

const LoadingSpinner = ({ className }: { className?: string }) => {
    return (
        <div className="flex h-32 items-center justify-center">
            <CgSpinner className={cn('size-10 animate-spin text-primary', className)} />
        </div>
    );
};
export default LoadingSpinner;
