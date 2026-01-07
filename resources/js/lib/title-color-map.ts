export const titleColorMap: Record<string, { bg: string; text: string; bgColor?: string; textColor?: string }> = {
    Admin: { bg: 'bg-red-100', text: 'text-red-800', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    Moderator: { bg: 'bg-blue-100', text: 'text-blue-800', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    VIP: { bg: 'bg-purple-100', text: 'text-purple-800', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    Premium: { bg: 'bg-yellow-100', text: 'text-yellow-800', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    Verified: { bg: 'bg-green-100', text: 'text-green-800', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
};

export const getTitleColor = (title?: string | null) => {
    if (!title) return titleColorMap['default'];
    return titleColorMap[title] || titleColorMap['default'];
};
