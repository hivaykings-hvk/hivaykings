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
        $offset = $request->query('offset', 0);
        $limit = $request->query('limit', self::QUESTIONS_PER_PAGE);
        $sort = $request->query('sort', 'trending'); // trending, latest

        $query = Question::with(['user']);

        if ($sort === 'latest') {
            // Latest: sort by created_at descending
            $query->orderBy('created_at', 'desc');
        } else {
            // Trending: sort by comments_count DESC, likes_count DESC, views DESC, created_at DESC
            $query->orderByRaw('comments_count DESC, likes_count DESC, views DESC, created_at DESC');
        }

        $questions = $query->skip($offset)->take($limit)->get();

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
                'likesCount' => $question->likes_count,
                'commentsCount' => $question->comments_count,
                'abuseReported' => $question->abuse_reported,
                'user' => [
                    'id' => $question->user->id,
                    'firstName' => $question->user->first_name,
                    'lastName' => $question->user->last_name,
                    'email' => $question->user->email,
                    'title' => $question->user->title,
                    'image' => $question->user->image_path,
                ],
                'isLiked' => $isLiked,
                'createdAt' => $question->created_at,
                'updatedAt' => $question->updated_at,
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
            'fromCity' => $question->from_city,
            'toCity' => $question->to_city,
            'hashtags' => $question->hashtags,
            'views' => $question->views,
            'likesCount' => 0,
            'commentsCount' => 0,
            'abuseReported' => false,
            'user' => [
                'id' => $question->user->id,
                'firstName' => $question->user->first_name,
                'lastName' => $question->user->last_name,
                'email' => $question->user->email,
                'title' => $question->user->title,
                'image' => $question->user->image_path,
            ],
            'isLiked' => false,
            'createdAt' => $question->created_at,
            'updatedAt' => $question->updated_at,
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
            'fromCity' => $question->from_city,
            'toCity' => $question->to_city,
            'hashtags' => $question->hashtags,
            'views' => $question->views,
            'likesCount' => $question->likes_count,
            'commentsCount' => $question->comments_count,
            'abuseReported' => $question->abuse_reported,
            'user' => [
                'id' => $question->user->id,
                'firstName' => $question->user->first_name,
                'lastName' => $question->user->last_name,
                'email' => $question->user->email,
                'title' => $question->user->title,
                'image' => $question->user->image_path,
            ],
            'isLiked' => $isLiked,
            'createdAt' => $question->created_at,
            'updatedAt' => $question->updated_at,
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
                'questionId' => $id,
                'isLiked' => false,
                'likesCount' => $question->likes_count,
            ]);
        } else {
            QuestionLike::create([
                'question_id' => $id,
                'user_id' => Auth::id(),
            ]);
            $question->increment('likes_count');
            return response()->json([
                'questionId' => $id,
                'isLiked' => true,
                'likesCount' => $question->likes_count,
            ]);
        }
    }

    public function report($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Please login to report abuse'], 401);
        }

        $question = Question::findOrFail($id);

        $question->update(['abuse_reported' => true]);

        return response()->json([
            'questionId' => $id,
            'report' => true,
            'message' => 'Question reported successfully',
        ]);
    }
}
