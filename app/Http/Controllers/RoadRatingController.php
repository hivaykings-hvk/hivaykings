<?php

namespace App\Http\Controllers;

use App\Models\RoadRating;
use App\Models\ChiefRoadRating;
use App\Models\UserRoadRating;
use App\Models\RoadRatingComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoadRatingController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'latest');

        $query = RoadRating::with(['user', 'chiefRating', 'userRatings']);

        if ($sort === 'popular') {
            $query->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginated = $query->paginate(10, ['*'], 'page', $page);

        $roadRatings = $paginated->items();

        $data = collect($roadRatings)->map(function ($rating) {
            $chiefRating = $rating->chiefRating()->first();
            $userRatings = $rating->userRatings;

            $totalReviews = $userRatings->count();
            
            $communityAvg = $totalReviews > 0 
                ? (
                    ($userRatings->sum('road_condition') +
                    $userRatings->sum('traffic') +
                    $userRatings->sum('facilities') +
                    $userRatings->sum('safety_index') +
                    $userRatings->sum('scenic_value')) /
                    ($totalReviews * 5)
                )
                : 0;

            return [
                'id' => $rating->id,
                'fromCity' => $rating->from_city,
                'toCity' => $rating->to_city,
                'highwayNumber' => $rating->highway_number,
                'description' => $rating->description,
                'distanceKm' => $rating->distance_km,
                'travelTimeMin' => $rating->travel_time_min,
                'image' => $rating->image,
                'region' => $rating->region,
                'chiefUser' => $rating->user ? [
                    'id' => $rating->user->id,
                    'firstName' => $rating->user->first_name,
                    'lastName' => $rating->user->last_name,
                    'title' => $rating->user->title,
                    'image' => $rating->user->image_path,
                ] : null,
                'averageRating' => $communityAvg,
                'totalReviews' => $totalReviews,
                'createdAt' => $rating->created_at,
                'updatedAt' => $rating->updated_at,
            ];
        })->toArray();

        return response()->json([
            'data' => $data,
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'has_more' => $paginated->hasMorePages(),
        ]);
    }

    public function show($id)
    {
        $rating = RoadRating::with(['user', 'chiefRating', 'userRatings', 'comments.user'])->findOrFail($id);

        $chiefRating = $rating->chiefRating()->first();
        $userRatings = $rating->userRatings;
        $totalReviews = $userRatings->count();

        $communityRoadConditionRating = $totalReviews > 0 ? $userRatings->avg('road_condition') : 0;
        $communityTrafficRating = $totalReviews > 0 ? $userRatings->avg('traffic') : 0;
        $communityFacilitiesRating = $totalReviews > 0 ? $userRatings->avg('facilities') : 0;
        $communitySafetyIndexRating = $totalReviews > 0 ? $userRatings->avg('safety_index') : 0;
        $communityScenicValueRating = $totalReviews > 0 ? $userRatings->avg('scenic_value') : 0;

        $averageRating = $totalReviews > 0
            ? (($communityRoadConditionRating + $communityTrafficRating + $communityFacilitiesRating + $communitySafetyIndexRating + $communityScenicValueRating) / 5)
            : 0;

        return response()->json([
            'data' => [
                'id' => $rating->id,
                'fromCity' => $rating->from_city,
                'toCity' => $rating->to_city,
                'highwayNumber' => $rating->highway_number,
                'description' => $rating->description,
                'distanceKm' => $rating->distance_km,
                'travelTimeMin' => $rating->travel_time_min,
                'image' => $rating->image,
                'region' => $rating->region,
                'chiefUser' => $rating->user ? [
                    'id' => $rating->user->id,
                    'firstName' => $rating->user->first_name,
                    'lastName' => $rating->user->last_name,
                    'title' => $rating->user->title,
                    'image' => $rating->user->image_path,
                ] : null,
                'chiefRating' => [
                    'roadCondition' => $chiefRating?->road_condition ?? 0,
                    'traffic' => $chiefRating?->traffic ?? 0,
                    'facilities' => $chiefRating?->facilities ?? 0,
                    'safetyIndex' => $chiefRating?->safety_index ?? 0,
                    'scenicValue' => $chiefRating?->scenic_value ?? 0,
                ],
                'communityRating' => [
                    'roadCondition' => $communityRoadConditionRating,
                    'traffic' => $communityTrafficRating,
                    'facilities' => $communityFacilitiesRating,
                    'safetyIndex' => $communitySafetyIndexRating,
                    'scenicValue' => $communityScenicValueRating,
                ],
                'totalUserRatings' => $totalReviews,
                'averageRating' => $averageRating,
                'comments' => $rating->comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'user' => [
                            'id' => $comment->user->id,
                            'firstName' => $comment->user->first_name,
                            'lastName' => $comment->user->last_name,
                            'title' => $comment->user->title,
                            'image' => $comment->user->image_path,
                        ],
                        'createdAt' => $comment->created_at,
                    ];
                })->toArray(),
                'createdAt' => $rating->created_at,
                'updatedAt' => $rating->updated_at,
            ]
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if user is admin
        // if ($request->user()->role !== 'admin') {
        //     return response()->json(['message' => 'You do not have permission to create road ratings'], 403);
        // }

        $validated = $request->validate([
            'from_city' => 'required|string|min:2|max:100',
            'to_city' => 'required|string|min:2|max:100',
            'highway_number' => 'required|string|min:2|max:50',
            'description' => 'required|string|min:10|max:5000',
            'distance_km' => 'required|numeric|min:0',
            'travel_time_min' => 'required|numeric|min:0',
            'image' => 'required|string',
            'region' => 'required|in:north,south,east,west,central',
        ]);

        $rating = RoadRating::create([
            'user_id' => Auth::id(),
            'from_city' => $validated['from_city'],
            'to_city' => $validated['to_city'],
            'highway_number' => $validated['highway_number'],
            'description' => $validated['description'],
            'distance_km' => $validated['distance_km'],
            'travel_time_min' => $validated['travel_time_min'],
            'image' => $validated['image'],
            'region' => $validated['region'],
        ]);

        return response()->json([
            'data' => [
                'id' => $rating->id,
                'fromCity' => $rating->from_city,
                'toCity' => $rating->to_city,
                'highwayNumber' => $rating->highway_number,
                'description' => $rating->description,
                'distanceKm' => $rating->distance_km,
                'travelTimeMin' => $rating->travel_time_min,
                'image' => $rating->image,
                'region' => $rating->region,
                'createdAt' => $rating->created_at,
            ]
        ], 201);
    }

    public function storeUserRating(Request $request, $roadRatingId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'road_condition' => 'required|numeric|min:0|max:5',
            'traffic' => 'required|numeric|min:0|max:5',
            'facilities' => 'required|numeric|min:0|max:5',
            'safety_index' => 'required|numeric|min:0|max:5',
            'scenic_value' => 'required|numeric|min:0|max:5',
        ]);

        $existingRating = UserRoadRating::where('road_rating_id', $roadRatingId)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingRating) {
            return response()->json(['message' => 'You have already rated this road'], 400);
        }

        $userRating = UserRoadRating::create([
            'road_rating_id' => $roadRatingId,
            'user_id' => Auth::id(),
            'road_condition' => $validated['road_condition'],
            'traffic' => $validated['traffic'],
            'facilities' => $validated['facilities'],
            'safety_index' => $validated['safety_index'],
            'scenic_value' => $validated['scenic_value'],
        ]);

        return response()->json([
            'data' => $userRating
        ], 201);
    }

    public function storeComment(Request $request, $roadRatingId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:3|max:5000',
        ]);

        $comment = RoadRatingComment::create([
            'road_rating_id' => $roadRatingId,
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json([
            'data' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'user' => [
                    'id' => $comment->user->id,
                    'firstName' => $comment->user->first_name,
                    'lastName' => $comment->user->last_name,
                    'title' => $comment->user->title,
                    'image' => $comment->user->image_path,
                ],
                'createdAt' => $comment->created_at,
            ]
        ], 201);
    }
}
