<?php

namespace App\Http\Controllers;

use App\Models\RoadRating;
use App\Models\RoadRatingComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoadRatingCommentController extends Controller
{
    /**
     * Get comments for a road rating
     */
    public function getComments(Request $request, $roadRatingId)
    {
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);

        $roadRating = RoadRating::findOrFail($roadRatingId);

        // Get top-level comments (no parent_id)
        $comments = $roadRating->comments()
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc')
            ->skip($offset)
            ->take($limit)
            ->with('user')
            ->get();

        // Get total count
        $total = $roadRating->comments()
            ->whereNull('parent_id')
            ->count();

        // Get child counts for each comment
        $childCounts = [];
        foreach ($comments as $comment) {
            $childCounts[$comment->id] = $comment->children()->count();
        }

        return response()->json([
            'data' => [
                'comments' => $comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'createdAt' => $comment->created_at,
                        'updatedAt' => $comment->updated_at,
                        'abuseReported' => (bool) $comment->abuse_reported,
                        'user' => [
                            'id' => $comment->user->id,
                            'firstName' => $comment->user->first_name,
                            'lastName' => $comment->user->last_name,
                            'title' => $comment->user->title,
                            'image' => $comment->user->image_path,
                        ],
                        'childCount' => $childCounts[$comment->id] ?? 0,
                    ];
                }),
                'total' => $total,
                'childCounts' => $childCounts,
            ],
        ]);
    }

    /**
     * Get child comments
     */
    public function getChildComments(Request $request, $parentId)
    {
        $limit = $request->query('limit', 5);
        $offset = $request->query('offset', 0);

        $parent = RoadRatingComment::findOrFail($parentId);

        // Get child comments
        $comments = $parent->children()
            ->orderBy('created_at', 'desc')
            ->skip($offset)
            ->take($limit)
            ->with('user')
            ->get();

        // Get total count
        $total = $parent->children()->count();

        return response()->json([
            'data' => [
                'comments' => $comments->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'createdAt' => $comment->created_at,
                        'updatedAt' => $comment->updated_at,
                        'abuseReported' => (bool) $comment->abuse_reported,
                        'user' => [
                            'id' => $comment->user->id,
                            'firstName' => $comment->user->first_name,
                            'lastName' => $comment->user->last_name,
                            'title' => $comment->user->title,
                            'image' => $comment->user->image_path,
                        ],
                    ];
                }),
                'total' => $total,
            ],
        ]);
    }

    /**
     * Get child count for a comment
     */
    public function getChildCount($parentId)
    {
        $parent = RoadRatingComment::findOrFail($parentId);
        $count = $parent->children()->count();

        return response()->json([
            'data' => [
                'count' => $count,
            ],
        ]);
    }

    /**
     * Create a comment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:3|max:5000',
            'roadRatingId' => 'required|exists:road_ratings,id',
            'parentId' => 'nullable|exists:road_rating_comments,id',
        ], [
            'content.required' => 'Comment is required',
            'content.min' => 'Comment must be at least 3 characters long',
            'content.max' => 'Comment cannot exceed 5000 characters',
            'roadRatingId.required' => 'Road rating ID is required',
            'roadRatingId.exists' => 'Road rating not found',
            'parentId.exists' => 'Parent comment not found',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized - Please login'], 401);
        }

        // Verify road rating exists
        $roadRating = RoadRating::findOrFail($validated['roadRatingId']);

        // Create the comment
        $comment = RoadRatingComment::create([
            'road_rating_id' => $validated['roadRatingId'],
            'user_id' => $user->id,
            'parent_id' => $validated['parentId'] ?? null,
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json(
            [
                'data' => [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'createdAt' => $comment->created_at,
                    'updatedAt' => $comment->updated_at,
                    'abuseReported' => (bool) $comment->abuse_reported,
                    'user' => [
                        'id' => $comment->user->id,
                        'firstName' => $comment->user->first_name,
                        'lastName' => $comment->user->last_name,
                        'title' => $comment->user->title,
                        'image' => $comment->user->image_path,
                    ],
                ],
            ],
            201
        );
    }

    /**
     * Create a child comment
     */
    public function storeChild(Request $request, $parentId)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:3|max:5000',
            'roadRatingId' => 'required|exists:road_ratings,id',
        ], [
            'content.required' => 'Comment is required',
            'content.min' => 'Comment must be at least 3 characters long',
            'content.max' => 'Comment cannot exceed 5000 characters',
            'roadRatingId.required' => 'Road rating ID is required',
            'roadRatingId.exists' => 'Road rating not found',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized - Please login'], 401);
        }

        // Verify parent comment exists
        $parent = RoadRatingComment::findOrFail($parentId);

        // Create child comment
        $comment = RoadRatingComment::create([
            'road_rating_id' => $validated['roadRatingId'],
            'user_id' => $user->id,
            'parent_id' => $parentId,
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json(
            [
                'data' => [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'createdAt' => $comment->created_at,
                    'updatedAt' => $comment->updated_at,
                    'abuseReported' => (bool) $comment->abuse_reported,
                    'user' => [
                        'id' => $comment->user->id,
                        'firstName' => $comment->user->first_name,
                        'lastName' => $comment->user->last_name,
                        'title' => $comment->user->title,
                        'image' => $comment->user->image_path,
                    ],
                ],
            ],
            201
        );
    }

    /**
     * Report a comment for abuse
     */
    public function report($commentId)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Please login to report abuse'], 401);
        }

        $comment = RoadRatingComment::findOrFail($commentId);

        $comment->update(['abuse_reported' => true]);

        return response()->json([
            'commentId' => $commentId,
            'abuseReported' => true,
            'message' => 'Comment reported successfully',
        ]);
    }
}
