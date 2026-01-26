<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmailMail;
use App\Models\EmailVerificationToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    public function show($token)
    {
        $verificationToken = EmailVerificationToken::where('token', $token)->first();

        if (!$verificationToken) {
            return Inertia::render('Auth/VerifyEmail', [
                'token' => $token,
                'error' => 'Invalid verification token.',
                'success' => false,
            ]);
        }

        if ($verificationToken->isExpired()) {
            $verificationToken->delete();
            return Inertia::render('Auth/VerifyEmail', [
                'token' => $token,
                'error' => 'Verification token has expired. Please request a new one.',
                'expired' => true,
                'success' => false,
            ]);
        }

        $user = $verificationToken->user;
        
        if ($user->email_verified_at) {
            $verificationToken->delete();
            return Inertia::render('Auth/VerifyEmail', [
                'token' => $token,
                'error' => 'Email already verified.',
                'alreadyVerified' => true,
                'success' => true,
            ]);
        }

        // Verify the email
        $user->update(['email_verified_at' => now()]);
        $verificationToken->delete();

        return Inertia::render('Auth/VerifyEmail', [
            'token' => $token,
            'success' => true,
            'verified' => true,
        ]);
    }

    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email is already verified.',
            ], 400);
        }

        // Delete old tokens
        EmailVerificationToken::where('user_id', $user->id)->delete();

        // Create new token
        $token = Str::random(64);
        EmailVerificationToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'created_at' => now(),
        ]);

        // Send email
        $verificationUrl = route('auth.verify-email', $token);
        Mail::send(new VerifyEmailMail(
            $user->email,
            $user->first_name . ' ' . $user->last_name,
            $verificationUrl,
            $token
        ));

        return response()->json([
            'message' => 'Verification email sent. Please check your email.',
        ], 200);
    }
}
