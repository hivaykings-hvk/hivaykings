<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PollsController extends Controller
{
    const POLLS_PER_PAGE = 10;

    public function index(Request $request)
    {
        $page = $request->query('page', 1);
        $sort = $request->query('sort', 'latest');

        $query = Poll::with(['user', 'options']);

        if ($sort === 'popular') {
            $query->orderBy('total_votes', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginated = $query->paginate(self::POLLS_PER_PAGE, ['*'], 'page', $page);

        $polls = $paginated->items();
        $userId = Auth::id();

        $data = collect($polls)->map(function ($poll) use ($userId) {
            $userVotedOptionIds = [];
            if ($userId) {
                $userVotedOptionIds = PollVote::whereIn('poll_option_id', $poll->options->pluck('id'))
                    ->where('user_id', $userId)
                    ->pluck('poll_option_id')
                    ->toArray();
            }

            return [
                'id' => $poll->id,
                'question_text' => $poll->question_text,
                'description' => $poll->description,
                'hashtags' => $poll->hashtags ? explode(',', $poll->hashtags) : [],
                'expires_at' => $poll->expires_at,
                'total_votes' => $poll->total_votes,
                'user' => [
                    'id' => $poll->user->id,
                    'name' => $poll->user->first_name . ' ' . $poll->user->last_name,
                    'email' => $poll->user->email,
                    'avatar_url' => $poll->user->image_path,
                ],
                'options' => $poll->options->map(function ($option) use ($userVotedOptionIds) {
                    return [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                        'votes' => $option->votes,
                        'user_voted' => in_array($option->id, $userVotedOptionIds),
                    ];
                })->toArray(),
                'created_at' => $poll->created_at,
                'updated_at' => $poll->updated_at,
            ];
        })->toArray();

        return response()->json([
            'data' => $data,
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'has_more' => $paginated->hasMorePages(),
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'question_text' => 'required|string|min:5|max:255',
            'description' => 'nullable|string',
            'hashtags' => 'nullable|array',
            'expires_at' => 'nullable|date',
            'options' => 'required|array|min:2',
            'options.*' => 'required|string|min:1',
        ]);

        $poll = Poll::create([
            'user_id' => Auth::id(),
            'question_text' => $validated['question_text'],
            'description' => $validated['description'] ?? null,
            'hashtags' => isset($validated['hashtags']) ? implode(',', $validated['hashtags']) : null,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        foreach ($validated['options'] as $optionText) {
            PollOption::create([
                'poll_id' => $poll->id,
                'option_text' => $optionText,
            ]);
        }

        $poll->load('user', 'options');

        return response()->json([
            'id' => $poll->id,
            'question_text' => $poll->question_text,
            'description' => $poll->description,
            'hashtags' => $poll->hashtags ? explode(',', $poll->hashtags) : [],
            'expires_at' => $poll->expires_at,
            'total_votes' => 0,
            'user' => [
                'id' => $poll->user->id,
                'name' => $poll->user->first_name . ' ' . $poll->user->last_name,
                'email' => $poll->user->email,
                'avatar_url' => $poll->user->image_path,
            ],
            'options' => $poll->options->map(function ($option) {
                return [
                    'id' => $option->id,
                    'option_text' => $option->option_text,
                    'votes' => 0,
                    'user_voted' => false,
                ];
            })->toArray(),
            'created_at' => $poll->created_at,
            'updated_at' => $poll->updated_at,
        ], 201);
    }

    public function vote(Request $request, $pollOptionId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Please login to vote'], 401);
        }

        $option = PollOption::with('poll')->findOrFail($pollOptionId);

        $existingVote = PollVote::where('poll_option_id', $pollOptionId)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingVote) {
            return response()->json(['message' => 'You have already voted on this option'], 400);
        }

        PollVote::create([
            'poll_option_id' => $pollOptionId,
            'user_id' => Auth::id(),
        ]);

        $option->increment('votes');
        $option->poll->increment('total_votes');

        return response()->json([
            'poll_id' => $option->poll->id,
            'option_id' => $pollOptionId,
            'votes' => $option->votes,
            'total_votes' => $option->poll->total_votes,
            'user_voted' => true,
        ]);
    }
}
