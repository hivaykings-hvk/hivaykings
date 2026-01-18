<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoadRating extends Model
{
    protected $fillable = [
        'user_id',
        'from_city',
        'to_city',
        'highway_number',
        'description',
        'distance_km',
        'travel_time_min',
        'image',
        'region',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function chiefRating(): HasMany
    {
        return $this->hasMany(ChiefRoadRating::class);
    }

    public function userRatings(): HasMany
    {
        return $this->hasMany(UserRoadRating::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(RoadRatingComment::class);
    }
}
