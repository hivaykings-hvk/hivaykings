<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'rememberMe' => 'boolean',
        ]);

        // Check if user exists and verify email status
        $user = \App\Models\User::where('email', $credentials['email'])->first();

        if ($user && is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'Please verify your email address before logging in.',
                'emailNotVerified' => true,
                'email' => $credentials['email'],
            ], 403);
        }

        $rememberMe = $credentials['rememberMe'] ?? false;

        if (Auth::attempt(
            [
                'email' => $credentials['email'],
                'password' => $credentials['password'],
            ],
            $rememberMe
        )) {
            $request->session()->regenerate();
            return response()->json([
                'message' => 'Login successful.',
                'user' => Auth::user(),
            ]);
        }

        return response()->json([
            'message' => 'Invalid email or password.',
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
