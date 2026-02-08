<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'username' => $user->username,
            'phone' => $user->phone,
            'city' => $user->city,
            'state' => $user->state,
            'country' => $user->country,
            'pincode' => $user->pincode,
            'image_path' => $user->image_path,
            'bio' => $user->bio,
            'subscribe_newsletter' => $user->subscribe_newsletter,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|min:2',
            'last_name' => 'sometimes|required|string|min:2',
            'username' => 'sometimes|string|min:3|unique:users,username,' . $user->id,
            'phone' => 'sometimes|string|nullable',
            'city' => 'sometimes|string|nullable',
            'state' => 'sometimes|string|nullable',
            'country' => 'sometimes|string|nullable',
            'pincode' => 'sometimes|string|nullable',
            'bio' => 'sometimes|string|nullable|max:500',
            'image_path' => 'sometimes|string|nullable',
            'subscribe_newsletter' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'username' => $user->username,
                'phone' => $user->phone,
                'city' => $user->city,
                'state' => $user->state,
                'country' => $user->country,
                'pincode' => $user->pincode,
                'image_path' => $user->image_path,
                'bio' => $user->bio,
                'subscribe_newsletter' => $user->subscribe_newsletter,
            ]
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[0-9]/',
                'regex:/[^A-Za-z0-9]/',
                'different:current_password',
            ],
        ], [
            'new_password.min' => 'Password must be at least 8 characters',
            'new_password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'new_password.different' => 'New password must be different from current password',
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }

    public function uploadImage(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $file->store("avatars/{$user->id}", 'public');
            
            return response()->json([
                'path' => $path,
            ]);
        }

        return response()->json(['message' => 'No image provided'], 400);
    }
}
