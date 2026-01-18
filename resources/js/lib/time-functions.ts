export const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(months / 12);
    return `${years}y ago`;
};

export const timeUntil = (dateString: string): string => {
    console.log('Calculating time until for date string:', dateString);
    const date = new Date(dateString);
    console.log('Calculating time until for date:', date);
    const now = new Date();
    const seconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    if (seconds <= 0) return 'ended';
    if (seconds < 60) return `${seconds}s left`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m left`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h left`;

    const days = Math.floor(hours / 24);
    return `${days}d left`;
};
