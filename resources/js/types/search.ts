export interface User {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    image?: string;
}

export interface Question {
    id: string;
    subject: string;
    description: string;
    fromCity?: string;
    toCity?: string;
    hashtags?: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    userId: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}

export interface RoadRatingChiefRating {
    roadCondition: number;
    traffic: number;
    facilities: number;
    safetyIndex: number;
    scenicValue: number;
}

export interface RoadRating {
    id: string;
    fromCity: string;
    toCity: string;
    highwayNumber: string;
    distanceKm: number;
    travelTimeMin: number;
    chiefRating?: RoadRatingChiefRating;
}

export interface ChiefReply {
    questionId: string;
    content: string;
    user: {
        firstName: string;
        lastName: string;
        title: string;
    };
}

export interface SearchResponse {
    questionsWithUser: Question[];
    total: number;
}
