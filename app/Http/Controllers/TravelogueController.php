<?php

namespace App\Http\Controllers;

use App\Models\Travelogue;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;

class TravelogueController extends Controller
{
    /**
     * Get all published travelogues with pagination
     */
    public function index(Request $request)
    {
        $skip = $request->query('skip', 0);
        $limit = $request->query('limit', 9);

        $travelogues = Travelogue::published()
            ->with('user:id,first_name,last_name,title,image_path')
            ->orderByDesc('published_at')
            ->skip($skip)
            ->take($limit)
            ->get()
            ->map(function ($travelogue) {
                return [
                    'id' => $travelogue->id,
                    'title' => $travelogue->title,
                    'content' => $travelogue->content,
                    'images' => $travelogue->cover_image ? [$travelogue->cover_image] : [],
                    'user' => [
                        'id' => $travelogue->user->id,
                        'firstName' => $travelogue->user->first_name,
                        'lastName' => $travelogue->user->last_name,
                        'title' => $travelogue->user->title,
                        'image' => $travelogue->user->image_path,
                    ],
                    'createdAt' => $travelogue->created_at->toIso8601String(),
                    'updatedAt' => $travelogue->updated_at->toIso8601String(),
                ];
            });

        $total = Travelogue::published()->count();

        return response()->json([
            'travelogues' => $travelogues,
            'total' => $total,
        ]);
    }

    /**
     * Get single travelogue by ID or slug
     */
    public function show($id)
    {
        $travelogue = Travelogue::published()
            ->with('user:id,first_name,last_name,title,image_path')
            ->find($id);

        if (!$travelogue) {
            return response()->json([
                'message' => 'Travelogue not found',
            ], 404);
        }

        return response()->json([
            'id' => $travelogue->id,
            'title' => $travelogue->title,
            'content' => $travelogue->content,
            'images' => $travelogue->cover_image ? [$travelogue->cover_image] : [],
            'user' => [
                'id' => $travelogue->user->id,
                'firstName' => $travelogue->user->first_name,
                'lastName' => $travelogue->user->last_name,
                'title' => $travelogue->user->title,
                'image' => $travelogue->user->image_path,
            ],
            'createdAt' => $travelogue->created_at->toIso8601String(),
            'updatedAt' => $travelogue->updated_at->toIso8601String(),
            'status' => $travelogue->status,
        ]);
    }

    /**
     * Create new travelogue
     */
    public function store(Request $request)
    {
        // Explicit auth check for API requests
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Unauthenticated. Please log in first.',
                'authenticated' => false,
                'user' => auth()->user(),
            ], 401);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'cover_image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
            'status' => 'required|in:draft,published',
        ]);

        // Store image to filesystem
        $imagePath = null;
        if ($request->hasFile('cover_image')) {
            $userId = Str::uuid();
            $imagePath = $request->file('cover_image')->store("travelogues/{$userId}", 'public');
        }

        $validated['user_id'] = auth()->id();
        $validated['cover_image'] = $imagePath;

        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $travelogue = Travelogue::create($validated);

        return response()->json([
            'message' => 'Travelogue ' . $validated['status'],
            'data' => $travelogue,
        ], 201);
    }

    /**
     * Update travelogue
     */
    public function update(Request $request, Travelogue $travelogue)
    {
        // Check authorization
        if ($travelogue->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'You do not have permission to update this travelogue',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'status' => 'required|in:draft,published',
        ]);

        // Store new image if provided
        if ($request->hasFile('cover_image')) {
            $userId = Str::uuid();
            $imagePath = $request->file('cover_image')->store("travelogues/{$userId}", 'public');
            $validated['cover_image'] = $imagePath;
        }

        // If changing from draft to published
        if ($travelogue->status === 'draft' && $validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $travelogue->update($validated);

        return response()->json([
            'message' => 'Travelogue updated',
            'data' => $travelogue,
        ]);
    }

    /**
     * Get user's travelogues (drafts and published)
     */
    public function userTravelogues()
    {
        $travelogues = Travelogue::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $travelogues,
        ]);
    }

    /**
     * Delete travelogue
     */
    public function destroy(Travelogue $travelogue)
    {
        // Check authorization
        if ($travelogue->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'You do not have permission to delete this travelogue',
            ], 403);
        }

        $travelogue->delete();

        return response()->json([
            'message' => 'Travelogue deleted',
        ]);
    }
}
