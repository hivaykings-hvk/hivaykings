<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class QuestionCommentController extends Controller
{
    /**
     * Get replies for a question
     */
    public function getReplies(Request $request, $questionId)
    {
        $limit = $request->query('limit', 10);
        $offset = $request->query('offset', 0);

        $question = Question::findOrFail($questionId);

        // Get top-level replies (no parent_id)
        $replies = $question->comments()
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc')
            ->skip($offset)
            ->take($limit)
            ->with('user')
            ->get();

        // Get total count
        $total = $question->comments()
            ->whereNull('parent_id')
            ->count();

        // Get child counts for each reply
        $childCounts = [];
        foreach ($replies as $reply) {
            $childCounts[$reply->id] = $reply->children()->count();
        }

        return response()->json([
            'data' => [
                'replies' => $replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'content' => $reply->content,
                        'createdAt' => $reply->created_at,
                        'updatedAt' => $reply->updated_at,
                        'user' => [
                            'id' => $reply->user->id,
                            'firstName' => $reply->user->first_name,
                            'lastName' => $reply->user->last_name,
                            'title' => $reply->user->title,
                            'image' => $reply->user->image_path,
                        ],
                        'childCount' => $childCounts[$reply->id] ?? 0,
                    ];
                }),
                'total' => $total,
                'childCounts' => $childCounts,
            ],
        ]);
    }

    /**
     * Get child replies
     */
    public function getChildReplies(Request $request, $parentId)
    {
        $limit = $request->query('limit', 5);
        $offset = $request->query('offset', 0);

        $parent = QuestionComment::findOrFail($parentId);

        // Get child replies
        $replies = $parent->children()
            ->orderBy('created_at', 'asc')
            ->skip($offset)
            ->take($limit)
            ->with('user')
            ->get();

        // Get total count
        $total = $parent->children()->count();

        return response()->json([
            'data' => [
                'replies' => $replies->map(function ($reply) {
                    return [
                        'id' => $reply->id,
                        'content' => $reply->content,
                        'createdAt' => $reply->created_at,
                        'updatedAt' => $reply->updated_at,
                        'user' => [
                            'id' => $reply->user->id,
                            'firstName' => $reply->user->first_name,
                            'lastName' => $reply->user->last_name,
                            'title' => $reply->user->title,
                            'image' => $reply->user->image_path,
                        ],
                    ];
                }),
                'total' => $total,
            ],
        ]);
    }

    /**
     * Get child count for a reply
     */
    public function getChildCount($parentId)
    {
        $parent = QuestionComment::findOrFail($parentId);
        $count = $parent->children()->count();

        return response()->json([
            'data' => [
                'count' => $count,
            ],
        ]);
    }

    /**
     * Create a reply
     */
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'content' => 'required|string|min:3|max:5000',
            'questionId' => 'required|exists:questions,id',
            'parentId' => 'nullable|exists:question_comments,id',
        ], [
            'content.required' => 'Reply content is required',
            'content.min' => 'Reply must be at least 3 characters long',
            'content.max' => 'Reply cannot exceed 5000 characters',
            'questionId.required' => 'Question ID is required',
            'questionId.exists' => 'Question not found',
            'parentId.exists' => 'Parent reply not found',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized - Please login'], 401);
        }

        // Verify question exists
        $question = Question::findOrFail($validated['questionId']);

        // Create the reply
        $reply = QuestionComment::create([
            'question_id' => $validated['questionId'],
            'user_id' => $user->id,
            'parent_id' => $validated['parentId'] ?? null,
            'content' => $validated['content'],
            'likes_count' => 0,
        ]);

        // Increment the comments count on the question (only for top-level comments)
        if (!isset($validated['parentId']) || !$validated['parentId']) {
            $question->increment('comments_count');
        }

        $reply->load('user');

        return response()->json(
            [
                'data' => [
                    'id' => $reply->id,
                    'content' => $reply->content,
                    'createdAt' => $reply->created_at,
                    'updatedAt' => $reply->updated_at,
                    'user' => [
                        'id' => $reply->user->id,
                        'firstName' => $reply->user->first_name,
                        'lastName' => $reply->user->last_name,
                        'title' => $reply->user->title,
                        'image' => $reply->user->image_path,
                    ],
                ],
            ],
            201
        );
    }

    /**
     * Create a child reply
     */
    public function storeChild(Request $request, $parentId)
    {
        // Validate input
        $validated = $request->validate([
            'content' => 'required|string|min:3|max:5000',
            'questionId' => 'required|exists:questions,id',
        ], [
            'content.required' => 'Reply content is required',
            'content.min' => 'Reply must be at least 3 characters long',
            'content.max' => 'Reply cannot exceed 5000 characters',
            'questionId.required' => 'Question ID is required',
            'questionId.exists' => 'Question not found',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized - Please login'], 401);
        }

        // Verify parent reply exists
        $parent = QuestionComment::findOrFail($parentId);

        // Create child reply
        $reply = QuestionComment::create([
            'question_id' => $validated['questionId'],
            'user_id' => $user->id,
            'parent_id' => $parentId,
            'content' => $validated['content'],
            'likes_count' => 0,
        ]);

        $reply->load('user');

        return response()->json(
            [
                'data' => [
                    'id' => $reply->id,
                    'content' => $reply->content,
                    'createdAt' => $reply->created_at,
                    'updatedAt' => $reply->updated_at,
                    'user' => [
                        'id' => $reply->user->id,
                        'firstName' => $reply->user->first_name,
                        'lastName' => $reply->user->last_name,
                        'title' => $reply->user->title,
                        'image' => $reply->user->image_path,
                    ],
                ],
            ],
            201
        );
    }
}
