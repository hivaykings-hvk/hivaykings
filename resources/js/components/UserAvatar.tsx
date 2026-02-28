import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    className?: string;
    imageUrl?: string | null | undefined;
    firstName: string;
    lastName: string;
}

const UserAvatar = ({ imageUrl, firstName, lastName, className }: UserAvatarProps) => {
    // Build image URL - handle both full URLs and relative paths
    let imageSrc = '';
    if (imageUrl) {
        if (imageUrl.startsWith('http')) {
            imageSrc = imageUrl;
        } else {
            imageSrc = `/storage/${imageUrl}`;
        }
    }

    return (
        <Avatar className="h-10 w-10 bg-gray-100 focus:border-none focus:ring-0 focus:outline-none">
            <AvatarImage src={imageSrc} className={cn('object-cover', className)} />
            <AvatarFallback className={cn('bg-yellow-50 text-gray-800', className)}>{`${firstName.charAt(0)}${lastName.charAt(0)}`}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
