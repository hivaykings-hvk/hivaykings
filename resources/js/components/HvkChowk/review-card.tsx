import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { timeAgo } from '@/lib/time-functions';
import { titleColorMap } from '@/lib/title-color-map';
import parse from 'html-react-parser';
import { FaRegComment, FaRegFlag, FaRegThumbsUp } from 'react-icons/fa6';

interface ReviewCardProps {
    comment: string;
    user?: {
        firstName?: string;
        lastName?: string;
        title?: string;
        image?: string;
    };
    createdAt?: string;
}

const ReviewCard = ({ comment, user, createdAt }: ReviewCardProps) => {
    return (
        <div className={`mb-4 rounded-lg p-4 shadow-sm ${user?.title === 'Chief' ? 'bg-yellow-50' : 'bg-white'}`}>
            <div className="mb-2 flex items-start">
                <Avatar className="mr-3 h-10 w-10">
                    <AvatarImage src={user?.image ? `/storage/${user.image}` : ''} alt={user?.firstName} className="object-cover" />
                    <AvatarFallback>{`${user?.firstName?.[0]}${user?.lastName?.[0]}`}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-800">
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div
                            className={`${user?.title && titleColorMap[user.title]?.bgColor} ${
                                user?.title && titleColorMap[user.title]?.textColor
                            } rounded-[4px] px-2.5 py-0.5 text-xs font-normal`}
                        >
                            {user?.title}
                        </div>
                        <div className="text-sm text-gray-500">{createdAt && timeAgo(createdAt)}</div>
                    </div>
                    <div className="mt-4 text-gray-700">{comment && parse(comment)}</div>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            <FaRegThumbsUp className="h-4 w-4 text-gray-500" /> <span className="text-sm">154 helpful</span>
                        </div>
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            <FaRegFlag className="h-4 w-4 text-gray-500" /> <span className="text-sm">Report</span>
                        </div>
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            <FaRegComment className="h-4 w-4 text-gray-500" /> <span className="text-sm">Reply</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
