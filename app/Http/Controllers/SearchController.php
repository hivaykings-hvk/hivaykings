<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\RoadRating;
use App\Models\QuestionLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Query\Expression;

class SearchController extends Controller
{
    const RESULTS_PER_PAGE = 10;

    public function search(Request $request)
    {
        $query = $request->query('q', '');
        $page = $request->query('page', 1);
        $skip = ($page - 1) * self::RESULTS_PER_PAGE;

        if (empty($query)) {
            return response()->json([
                'questionsWithUser' => [],
                'total' => 0,
            ]);
        }

        // Search questions using full-text search
        $questions = Question::with('user')
            ->whereRaw('MATCH(subject, description) AGAINST(? IN BOOLEAN MODE)', [$this->escapeSearchQuery($query)])
            ->orderByRaw('MATCH(subject, description) AGAINST(? IN BOOLEAN MODE) DESC', [$this->escapeSearchQuery($query)])
            ->orderBy('created_at', 'desc')
            ->skip($skip)
            ->take(self::RESULTS_PER_PAGE)
            ->get();

        $userId = Auth::id();

        $questionsData = collect($questions)->map(function ($question) use ($userId) {
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
                'viewsCount' => $question->views,
                'likesCount' => $question->likes_count,
                'commentsCount' => $question->comments_count,
                'userId' => $question->user_id,
                'user' => [
                    'id' => $question->user->id,
                    'firstName' => $question->user->first_name,
                    'lastName' => $question->user->last_name,
                    'email' => $question->user->email,
                    'title' => $question->user->title,
                    'image' => $question->user->image_path,
                ],
                'isLiked' => $isLiked,
                'createdAt' => $question->created_at->toIso8601String(),
                'updatedAt' => $question->updated_at->toIso8601String(),
            ];
        })->toArray();

        // Get total count
        $total = Question::whereRaw('MATCH(subject, description) AGAINST(? IN BOOLEAN MODE)', [$this->escapeSearchQuery($query)])
            ->count();

        return response()->json([
            'questionsWithUser' => $questionsData,
            'total' => $total,
        ]);
    }

    public function searchRoadRatings(Request $request)
    {
        $query = $request->query('q', '');

        if (empty($query)) {
            return response()->json(null);
        }

        // Search road ratings using full-text search
        $roadRating = RoadRating::with(['chiefRating', 'userRatings'])
            ->whereRaw('MATCH(from_city, to_city, highway_number, description) AGAINST(? IN BOOLEAN MODE)', [$this->escapeSearchQuery($query)])
            ->orderByRaw('MATCH(from_city, to_city, highway_number, description) AGAINST(? IN BOOLEAN MODE) DESC', [$this->escapeSearchQuery($query)])
            ->first();

        if (!$roadRating) {
            return response()->json(null);
        }

        $chiefRating = $roadRating->chiefRating()->first();

        return response()->json([
            'id' => $roadRating->id,
            'fromCity' => $roadRating->from_city,
            'toCity' => $roadRating->to_city,
            'highwayNumber' => $roadRating->highway_number,
            'description' => $roadRating->description,
            'distanceKm' => $roadRating->distance_km,
            'travelTimeMin' => $roadRating->travel_time_hours * 60,
            'region' => $roadRating->region,
            'chiefRating' => $chiefRating ? [
                'roadCondition' => $chiefRating->road_condition,
                'traffic' => $chiefRating->traffic,
                'facilities' => $chiefRating->facilities,
                'safetyIndex' => $chiefRating->safety_index,
                'scenicValue' => $chiefRating->scenic_value,
            ] : null,
        ]);
    }

    public function getChiefReply(Request $request)
    {
        $questionIds = $request->query('ids', []);

        if (empty($questionIds)) {
            return response()->json(null);
        }

        // Get first question with a verified chief reply
        $questionIds = is_array($questionIds) ? $questionIds : explode(',', $questionIds);

        // Find the first question that has a chief comment
        foreach ($questionIds as $questionId) {
            $question = Question::with(['comments.user'])
                ->find($questionId);

            if ($question) {
                $chiefComment = $question->comments->first(function ($c) {
                    return $c->user && strtolower($c->user->title) === 'chief';
                });

                if ($chiefComment) {
                    return response()->json([
                        'questionId' => $question->id,
                        'content' => $chiefComment->content,
                        'user' => [
                            'firstName' => $chiefComment->user->first_name,
                            'lastName' => $chiefComment->user->last_name,
                            'title' => $chiefComment->user->title,
                        ],
                    ]);
                }
            }
        }

        return response()->json(null);
    }

    private function escapeSearchQuery(string $query): string
    {
        // Escape special characters in MySQL full-text search
        $query = preg_replace('/([\+\-<>@\(\)~"\*&|])/', '\\\$1', $query);
        // Add wildcard
        return $query . '*';
    }
}
