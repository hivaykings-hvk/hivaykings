<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/auth/signup', function () {
        return Inertia::render('Auth/SignUp');
    })->name('auth.signup');

    Route::post('/auth/register', [RegisterController::class, 'register']);

    Route::get('/auth/signin', function () {
        return Inertia::render('Auth/SignIn', [
            'redirectUrl' => request()->query('redirect', '/'),
        ]);
    })->name('auth.signin');

    Route::post('/auth/login', [LoginController::class, 'login']);
});

Route::middleware(['auth.redirect'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// API Routes with session support
Route::get('/api/user', function (Request $request) {
    $user = $request->user();
    if ($user) {
        return response()->json([
            'id' => $user->id,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'title' => $user->title,
            'username' => $user->username,
            'email' => $user->email,
            'phone' => $user->phone,
            'image' => $user->image_path,
            'city' => $user->city,
            'state' => $user->state,
            'country' => $user->country,
            'pincode' => $user->pincode,
            'emailVerified' => $user->email_verified_at,
            'phoneVerified' => $user->phone_verified,
            'subscribeNewsletter' => $user->subscribe_newsletter,
        ]);
    }
    return response()->json(null, 401);
});

Route::middleware('auth')->post('/api/logout', [LoginController::class, 'logout']);
