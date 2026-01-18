import { z } from 'zod';

export const CreateRoadRatingFormSchema = z.object({
    fromCity: z.string().min(1, 'From city is required').min(2, 'From city must be at least 2 characters'),
    toCity: z.string().min(1, 'To city is required').min(2, 'To city must be at least 2 characters'),
    highwayNumber: z.string().min(1, 'Highway number is required'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description must not exceed 5000 characters'),
    distanceKm: z.coerce.number().min(0, 'Distance must be a positive number'),
    travelTimeMin: z.coerce.number().min(0, 'Travel time must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    region: z.enum(['north', 'south', 'east', 'west']),
});

export type CreateRoadRatingFormSchemaType = z.infer<typeof CreateRoadRatingFormSchema>;

export const RoadRatingSchema = z.object({
    roadCondition: z.coerce.number().min(0).max(5),
    traffic: z.coerce.number().min(0).max(5),
    facilities: z.coerce.number().min(0).max(5),
    safetyIndex: z.coerce.number().min(0).max(5),
    scenicValue: z.coerce.number().min(0).max(5),
});

export type RoadRatingSchemaType = z.infer<typeof RoadRatingSchema>;

export const RoadRatingCommentSchema = z.object({
    content: z.string().min(3, 'Comment must be at least 3 characters').max(5000, 'Comment must not exceed 5000 characters'),
});

export type RoadRatingCommentSchemaType = z.infer<typeof RoadRatingCommentSchema>;
