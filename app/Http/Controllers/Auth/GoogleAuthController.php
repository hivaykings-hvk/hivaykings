<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $user = Socialite::driver('google')->user();

            // Check if user exists by email
            $existingUser = User::where('email', $user->email)->first();

            if ($existingUser) {
                Auth::login($existingUser, true);
                return redirect('/account-settings');
            }

            // Create new user
            $newUser = User::create([
                'name' => $user->name,
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'email' => $user->email,
                'username' => $this->generateUniqueUsername($user->email),
                'password' => bcrypt(Str::random(16)),
                'image_path' => $this->downloadProfilePicture($user),
                'subscribe_newsletter' => false,
                'email_verified_at' => now(), // Auto-verify email for OAuth users
            ]);

            Auth::login($newUser, true);
            return redirect('/account-settings');
        } catch (\Exception $e) {
            return redirect('/auth/signin')->with('error', 'Google login failed. Please try again.');
        }
    }

    private function generateUniqueUsername($email)
    {
        $baseUsername = explode('@', $email)[0];
        $username = $baseUsername;
        $count = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $count;
            $count++;
        }

        return $username;
    }

    private function downloadProfilePicture($user)
    {
        try {
            if ($user->avatar) {
                $userId = Str::uuid();
                $imageName = $userId . '.jpg';
                $imagePath = "avatars/{$userId}";

                // Create directory if it doesn't exist
                if (!file_exists(storage_path("app/public/{$imagePath}"))) {
                    mkdir(storage_path("app/public/{$imagePath}"), 0755, true);
                }

                // Download and save image
                $imageContent = file_get_contents($user->avatar);
                file_put_contents(storage_path("app/public/{$imagePath}/{$imageName}"), $imageContent);

                return "{$imagePath}/{$imageName}";
            }
        } catch (\Exception $e) {
            // If image download fails, continue without image
        }

        return null;
    }
}
