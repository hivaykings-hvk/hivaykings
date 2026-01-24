<?php

return [
    'google' => [
        'client_id' => env('AUTH_GOOGLE_ID'),
        'client_secret' => env('AUTH_GOOGLE_SECRET'),
        'redirect' => env('APP_URL') . '/auth/google/callback',
    ],

    'facebook' => [
        'client_id' => env('AUTH_FACEBOOK_ID'),
        'client_secret' => env('AUTH_FACEBOOK_SECRET'),
        'redirect' => env('APP_URL') . '/auth/facebook/callback',
    ],
];
