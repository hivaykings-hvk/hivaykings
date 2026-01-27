<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function uploadImage(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,webp|max:2048',
        ]);

        $file = $validated['image'];
        $userId = Auth::id();
        
        // Store image in storage/app/public/user-images/{user_id}
        $path = $file->storeAs(
            "user-images/{$userId}",
            uniqid() . '.' . $file->getClientOriginalExtension(),
            'public'
        );

        $imageUrl = Storage::disk('public')->url($path);

        return response()->json([
            'image_url' => $imageUrl,
            'path' => $path,
        ]);
    }

    public function getUserImages(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = Auth::id();
        $userImagePath = "user-images/{$userId}";

        $images = [];
        
        // Check if directory exists
        if (Storage::disk('public')->exists($userImagePath)) {
            $files = Storage::disk('public')->files($userImagePath);
            
            foreach ($files as $file) {
                $images[] = Storage::disk('public')->url($file);
            }
        }

        return response()->json([
            'images' => array_reverse($images), // Latest first
        ]);
    }
}
