<?php

namespace App\Http\Controllers;

use App\Models\QuestionComment;
use App\Models\CommentLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionCommentsController extends Controller
{
    public function index($questionId)
    {
        $comments = QuestionComment::where('question_id', $questionId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $userId = Auth::id();

        $data = $comments->map(function ($comment) use ($userId) {
            $isLiked = false;
            if ($userId) {
                $isLiked = CommentLike::where('comment_id', $comment->id)
                    ->where('user_id', $userId)
                    ->exists();
            }

            return [
                'id' => $comment->id,
                'content' => $comment->content,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->first_name . ' ' . $comment->user->last_name,
                    'email' => $comment->user->email,
                    'avatar_url' => $comment->user->image_path,
                ],
                'likes_count' => $comment->likes_count,
                'is_liked' => $isLiked,
                'created_at' => $comment->created_at,
                'updated_at' => $comment->updated_at,
            ];
        })->toArray();

        return response()->json([
            'data' => $data,
        ]);
    }

    public function store(Request $request, $questionId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Please login to comment'], 401);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:2',
        ]);

        $comment = QuestionComment::create([
            'question_id' => $questionId,
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json([
            'id' => $comment->id,
            'content' => $comment->content,
            'user' => [
                'id' => $comment->user->id,
                'name' => $comment->user->first_name . ' ' . $comment->user->last_name,
                'email' => $comment->user->email,
                'avatar_url' => $comment->user->image_path,
            ],
            'likes_count' => 0,
            'is_liked' => false,
            'created_at' => $comment->created_at,
            'updated_at' => $comment->updated_at,
        ], 201);
    }

    public function like($commentId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Please login to like'], 401);
        }

        $comment = QuestionComment::findOrFail($commentId);

        $like = CommentLike::where('comment_id', $commentId)
            ->where('user_id', Auth::id())
            ->first();

        if ($like) {
            $like->delete();
            $comment->decrement('likes_count');
            return response()->json([
                'comment_id' => $commentId,
                'is_liked' => false,
                'likes_count' => $comment->likes_count,
            ]);
        } else {
            CommentLike::create([
                'comment_id' => $commentId,
                'user_id' => Auth::id(),
            ]);
            $comment->increment('likes_count');
            return response()->json([
                'comment_id' => $commentId,
                'is_liked' => true,
                'likes_count' => $comment->likes_count,
            ]);
        }
    }
}
