<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestionsController extends Controller
{
    const QUESTIONS_PER_PAGE = 10;

    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', self::QUESTIONS_PER_PAGE);
        $sort = $request->query('sort', 'latest'); // latest, popular

        $query = Question::with(['user']);

        if ($sort === 'popular') {
            $query->orderBy('likes_count', 'desc')->orderBy('comments_count', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $skip = ($page - 1) * $limit;
        $questions = $query->skip($skip)->take($limit)->get();

        $userId = Auth::id();

        $data = collect($questions)->map(function ($question) use ($userId) {
            $isLiked = false;
            if ($userId) {
                $isLiked = QuestionLike::where('question_id', $question->id)
                    ->where('user_id', $userId)
                    ->exists();
            }

            return [
                'id' => $question->id,
                'subject' => $question->subject,
                'description' => $question->description,
                'fromCity' => $question->from_city,
                'toCity' => $question->to_city,
                'hashtags' => $question->hashtags,
                'views' => $question->views,
                'likes_count' => $question->likes_count,
                'comments_count' => $question->comments_count,
                'user' => [
                    'id' => $question->user->id,
                    'firstName' => $question->user->first_name,
                    'lastName' => $question->user->last_name,
                    'email' => $question->user->email,
                    'image' => $question->user->image_path,
                ],
                'is_liked' => $isLiked,
                'created_at' => $question->created_at,
                'updated_at' => $question->updated_at,
            ];
        })->toArray();

        return response()->json([
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'subject' => 'required|string|min:5|max:255',
            'description' => 'required|string|min:10',
            'fromCity' => 'required|string',
            'toCity' => 'required|string',
            'hashtags' => 'required|string',
        ]);

        $question = Question::create([
            'user_id' => Auth::id(),
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'from_city' => $validated['fromCity'] ?? null,
            'to_city' => $validated['toCity'] ?? null,
            'hashtags' => $validated['hashtags'] ?? null,
        ]);

        $question->load('user');

        return response()->json([
            'id' => $question->id,
            'subject' => $question->subject,
            'description' => $question->description,
            'from_city' => $question->from_city,
            'to_city' => $question->to_city,
            'hashtags' => $question->hashtags,
            'views' => $question->views,
            'likes_count' => 0,
            'comments_count' => 0,
            'user' => [
                'id' => $question->user->id,
                'name' => $question->user->first_name . ' ' . $question->user->last_name,
                'email' => $question->user->email,
                'avatar_url' => $question->user->image_path,
            ],
            'is_liked' => false,
            'created_at' => $question->created_at,
            'updated_at' => $question->updated_at,
        ], 201);
    }

    public function show($id)
    {
        $question = Question::with(['user', 'comments.user'])->findOrFail($id);

        // Increment views
        $question->increment('views');

        $userId = Auth::id();
        $isLiked = false;
        if ($userId) {
            $isLiked = QuestionLike::where('question_id', $question->id)
                ->where('user_id', $userId)
                ->exists();
        }

        return response()->json([
            'id' => $question->id,
            'subject' => $question->subject,
            'description' => $question->description,
            'from_city' => $question->from_city,
            'to_city' => $question->to_city,
            'hashtags' => $question->hashtags,
            'views' => $question->views,
            'likes_count' => $question->likes_count,
            'comments_count' => $question->comments_count,
            'user' => [
                'id' => $question->user->id,
                'name' => $question->user->first_name . ' ' . $question->user->last_name,
                'email' => $question->user->email,
                'avatar_url' => $question->user->image_path,
            ],
            'is_liked' => $isLiked,
            'created_at' => $question->created_at,
            'updated_at' => $question->updated_at,
        ]);
    }

    public function like($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Please login to like'], 401);
        }

        $question = Question::findOrFail($id);

        $like = QuestionLike::where('question_id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if ($like) {
            $like->delete();
            $question->decrement('likes_count');
            return response()->json([
                'question_id' => $id,
                'is_liked' => false,
                'likes_count' => $question->likes_count,
            ]);
        } else {
            QuestionLike::create([
                'question_id' => $id,
                'user_id' => Auth::id(),
            ]);
            $question->increment('likes_count');
            return response()->json([
                'question_id' => $id,
                'is_liked' => true,
                'likes_count' => $question->likes_count,
            ]);
        }
    }
}
