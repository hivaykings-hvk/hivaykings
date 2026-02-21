<?php

namespace App\Http\Controllers;

use App\Models\TravelogueComment;
use App\Models\Travelogue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TravelogueCommentController extends Controller
{
    /**
     * Get all top-level comments for a travelogue
     */
    public function getComments($travelogueId)
    {
        $comments = TravelogueComment::where('travelogue_id', $travelogueId)
            ->whereNull('parent_id')
            ->with('user:id,first_name,last_name,title,image_path')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'abuseReported' => $comment->abuse_reported,
                    'user' => [
                        'id' => $comment->user->id,
                        'firstName' => $comment->user->first_name,
                        'lastName' => $comment->user->last_name,
                        'title' => $comment->user->title,
                        'image' => $comment->user->image_path,
                    ],
                    'createdAt' => $comment->created_at->toIso8601String(),
                    'updatedAt' => $comment->updated_at->toIso8601String(),
                ];
            });

        return response()->json([
            'data' => $comments,
        ]);
    }

    /**
     * Get child comments for a parent comment
     */
    public function getChildComments($parentId)
    {
        $comments = TravelogueComment::where('parent_id', $parentId)
            ->with('user:id,first_name,last_name,title,image_path')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'abuseReported' => $comment->abuse_reported,
                    'user' => [
                        'id' => $comment->user->id,
                        'firstName' => $comment->user->first_name,
                        'lastName' => $comment->user->last_name,
                        'title' => $comment->user->title,
                        'image' => $comment->user->image_path,
                    ],
                    'createdAt' => $comment->created_at->toIso8601String(),
                    'updatedAt' => $comment->updated_at->toIso8601String(),
                ];
            });

        return response()->json([
            'data' => $comments,
        ]);
    }

    /**
     * Get count of child comments
     */
    public function getChildCount($parentId)
    {
        $count = TravelogueComment::where('parent_id', $parentId)->count();

        return response()->json([
            'count' => $count,
        ]);
    }

    /**
     * Store a top-level comment
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'travelogue_id' => 'required|uuid|exists:travelogues,id',
            'content' => 'required|string|min:3|max:5000',
        ]);

        $comment = TravelogueComment::create([
            'travelogue_id' => $validated['travelogue_id'],
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json([
            'data' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'abuseReported' => $comment->abuse_reported,
                'user' => [
                    'id' => $comment->user->id,
                    'firstName' => $comment->user->first_name,
                    'lastName' => $comment->user->last_name,
                    'title' => $comment->user->title,
                    'image' => $comment->user->image_path,
                ],
                'createdAt' => $comment->created_at->toIso8601String(),
            ]
        ], 201);
    }

    /**
     * Store a nested (child) comment
     */
    public function storeChild(Request $request, $parentId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $parentComment = TravelogueComment::findOrFail($parentId);

        $validated = $request->validate([
            'content' => 'required|string|min:3|max:5000',
        ]);

        $comment = TravelogueComment::create([
            'travelogue_id' => $parentComment->travelogue_id,
            'user_id' => Auth::id(),
            'parent_id' => $parentId,
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json([
            'data' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'abuseReported' => $comment->abuse_reported,
                'user' => [
                    'id' => $comment->user->id,
                    'firstName' => $comment->user->first_name,
                    'lastName' => $comment->user->last_name,
                    'title' => $comment->user->title,
                    'image' => $comment->user->image_path,
                ],
                'createdAt' => $comment->created_at->toIso8601String(),
            ]
        ], 201);
    }

    /**
     * Report a comment as abusive
     */
    public function report(Request $request, $commentId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $comment = TravelogueComment::findOrFail($commentId);

        $comment->update(['abuse_reported' => true]);

        return response()->json([
            'message' => 'Comment reported successfully',
            'data' => [
                'id' => $comment->id,
                'abuseReported' => $comment->abuse_reported,
            ],
        ]);
    }
}
