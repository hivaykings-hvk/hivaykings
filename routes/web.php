<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;

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
