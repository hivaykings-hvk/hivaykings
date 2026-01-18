<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Inertia\Inertia;

class QuestionDetailController extends Controller
{
    public function show($id)
    {
        // Get the question
        $question = Question::with('user')->findOrFail($id);

        // Increment view count - using viewsCount or views
        $question->increment('views');

        // Get reply count - count only top-level replies (no parent_id)
        $totalReplies = $question->comments()->whereNull('parent_id')->count();

        return Inertia::render('HvkChowk/QuestionDetails', [
            'question' => [
                'id' => $question->id,
                'subject' => $question->subject,
                'description' => $question->description,
                'fromCity' => $question->from_city,
                'toCity' => $question->to_city,
                'hashtags' => $question->hashtags,
                'category' => null,
                'viewsCount' => $question->views,
                'likesCount' => $question->likes_count,
                'createdAt' => $question->created_at,
                'user' => [
                    'id' => $question->user->id,
                    'firstName' => $question->user->first_name,
                    'lastName' => $question->user->last_name,
                    'title' => $question->user->title,
                    'image' => $question->user->image_path,
                ],
            ],
            'totalReplies' => $totalReplies,
        ]);
    }
}
