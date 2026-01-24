<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class FacebookAuthController
{
    public function redirect()
    {
        return Socialite::driver('facebook')->redirect();
    }

    public function callback(Request $request)
    {
        try {
            $facebookUser = Socialite::driver('facebook')->user();
        } catch (\Exception $e) {
            return redirect('/auth/signin')->with('error', 'Facebook authentication failed');
        }

        $user = User::where('email', $facebookUser->getEmail())->first();

        if ($user) {
            Auth::login($user, true);
        } else {
            $username = $this->generateUniqueUsername($facebookUser->getName());
            
            $user = User::create([
                'name' => $facebookUser->getName(),
                'first_name' => explode(' ', $facebookUser->getName())[0],
                'last_name' => count(explode(' ', $facebookUser->getName())) > 1 
                    ? explode(' ', $facebookUser->getName())[1] 
                    : '',
                'email' => $facebookUser->getEmail(),
                'username' => $username,
                'password' => bcrypt(Str::random(16)),
                'subscribe_newsletter' => false,
            ]);

            // Download and store profile picture
            $this->downloadProfilePicture($user, $facebookUser->getAvatar());

            Auth::login($user, true);
        }

        return redirect('/dashboard');
    }

    private function generateUniqueUsername(string $name): string
    {
        $username = Str::slug(explode(' ', $name)[0]);
        $baseUsername = $username;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        return $username;
    }

    private function downloadProfilePicture(User $user, string $url): void
    {
        try {
            $userId = $user->id;
            $directory = storage_path("app/public/avatars/$userId");

            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            $imageContent = file_get_contents($url);
            $filename = "$userId.jpg";
            $filepath = "$directory/$filename";

            File::put($filepath, $imageContent);

            $user->update(['image_path' => "avatars/$userId/$filename"]);
        } catch (\Exception $e) {
            // Silently fail - user can upload picture later
        }
    }
}
