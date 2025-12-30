<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|min:2',
            'lastName' => 'required|string|min:2',
            'title' => 'nullable|string',
            'username' => 'required|string|min:2|unique:users',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string|min:10',
            'password' => ['required', Password::min(8)->letters()->numbers()->symbols()],
            'confirmPassword' => 'required|same:password',
            'city' => 'required|string|min:2',
            'state' => 'required|string|min:2',
            'country' => 'required|string|min:2',
            'pincode' => 'required|string|min:4',
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
            'subscribeNewsletter' => 'boolean',
        ]);

        try {
            // Store image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $userId = Str::uuid();
                $imagePath = $request->file('image')->store("avatars/{$userId}", 'public');
            }

            // Create user
            $user = User::create([
                'name' => $validated['firstName'] . ' ' . $validated['lastName'],
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'title' => $validated['title'] ?? null,
                'username' => $validated['username'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'country' => $validated['country'],
                'pincode' => $validated['pincode'],
                'password' => Hash::make($validated['password']),
                'image_path' => $imagePath,
                'subscribe_newsletter' => $validated['subscribeNewsletter'] ?? false,
            ]);

            return response()->json([
                'message' => 'Registration successful. Please sign in with your credentials.',
                'user' => $user,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
