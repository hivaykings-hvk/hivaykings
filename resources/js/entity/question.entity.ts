export interface Question {
    id: string;
    fromCity: string;
    toCity: string;
    subject: string;
    description: string;
    hashtags?: string;
    category?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        title: string;
        image?: string;
    };
}
