<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\FacebookAuthController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\QuestionCommentController;
use App\Http\Controllers\PollsController;
use App\Http\Controllers\RoadRatingController;
use App\Http\Controllers\QuestionDetailController;
use App\Http\Controllers\TravelogueController;
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

    // Google OAuth Routes
    Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

    // Facebook OAuth Routes
    Route::get('/auth/facebook', [FacebookAuthController::class, 'redirect'])->name('auth.facebook');
    Route::get('/auth/facebook/callback', [FacebookAuthController::class, 'callback']);
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

// Road Ratings Routes
Route::get('/road-ratings', function () {
    return Inertia::render('RoadRatings');
})->name('road-ratings');

Route::get('/road-ratings/create', function () {
    return Inertia::render('CreateRoadRating');
})->name('road-ratings.create');

Route::get('/road-ratings/{id}', function ($id) {
    return Inertia::render('RoadRatingDetail', [
        'id' => $id,
    ]);
})->name('road-ratings.show');

// Travelogue Routes
Route::get('/travelogue', function () {
    return Inertia::render('Travelogue');
})->name('travelogue');

Route::get('/travelogue/create', function () {
    return Inertia::render('CreateTravelogue');
})->name('travelogue.create');

Route::get('/travelogue/{id}', function ($id) {
    return Inertia::render('TravelogueDetail', [
        'id' => $id,
    ]);
})->name('travelogue.show');

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

// Road Ratings API Routes
Route::get('/api/road-ratings', [RoadRatingController::class, 'index']);
Route::get('/api/road-ratings/{id}', [RoadRatingController::class, 'show']);
Route::post('/api/road-ratings', [RoadRatingController::class, 'store']);
Route::post('/api/road-ratings/{roadRatingId}/user-rating', [RoadRatingController::class, 'storeUserRating']);
Route::post('/api/road-ratings/{roadRatingId}/comments', [RoadRatingController::class, 'storeComment']);

// Travelogue API Routes
Route::get('/api/travelogues', [TravelogueController::class, 'index']);
Route::get('/api/travelogues/{id}', [TravelogueController::class, 'show']);

// Protected travelogue routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::post('/api/travelogues', [TravelogueController::class, 'store']);
    Route::put('/api/travelogues/{travelogue}', [TravelogueController::class, 'update']);
    Route::delete('/api/travelogues/{travelogue}', [TravelogueController::class, 'destroy']);
    Route::get('/api/user/travelogues', [TravelogueController::class, 'userTravelogues']);
});

Route::middleware('auth')->post('/api/logout', [LoginController::class, 'logout']);
