<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\QuestionCommentController;
use App\Http\Controllers\PollsController;
use App\Http\Controllers\QuestionDetailController;
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

// HVK Chowk Routes
Route::get('/hvk-chowk', function (Request $request) {
    $user = $request->user() ? [
        'id' => $request->user()->id,
        'name' => $request->user()->first_name . ' ' . $request->user()->last_name,
        'email' => $request->user()->email,
        'avatar_url' => $request->user()->image_path,
    ] : null;

    return Inertia::render('HvkChowk/page', [
        'user' => $user,
    ]);
})->name('hvk-chowk');

Route::get('/hvk-chowk/question/{id}', [QuestionDetailController::class, 'show'])->name('question.show');

// Questions API Routes
Route::get('/api/questions', [QuestionsController::class, 'index']);
Route::post('/api/questions', [QuestionsController::class, 'store']);
Route::get('/api/questions/{id}', [QuestionsController::class, 'show']);
Route::post('/api/questions/{id}/like', [QuestionsController::class, 'like']);

// Question Replies API Routes
Route::get('/api/questions/{questionId}/replies', [QuestionCommentController::class, 'getReplies']);
Route::get('/api/replies/{parentId}/children', [QuestionCommentController::class, 'getChildReplies']);
Route::get('/api/replies/{parentId}/child-count', [QuestionCommentController::class, 'getChildCount']);

// Protected reply submission routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::post('/api/replies', [QuestionCommentController::class, 'store']);
    Route::post('/api/replies/{parentId}/child', [QuestionCommentController::class, 'storeChild']);
});

// Question Comments API Routes
Route::get('/api/questions/{questionId}/comments', [QuestionCommentController::class, 'index']);
Route::post('/api/questions/{questionId}/comments', [QuestionCommentController::class, 'store']);
Route::post('/api/comments/{commentId}/like', [QuestionCommentController::class, 'like']);

// Polls API Routes
Route::get('/api/polls', [PollsController::class, 'index']);
Route::post('/api/polls', [PollsController::class, 'store']);
Route::post('/api/poll-options/{pollOptionId}/vote', [PollsController::class, 'vote']);

Route::middleware('auth')->post('/api/logout', [LoginController::class, 'logout']);
