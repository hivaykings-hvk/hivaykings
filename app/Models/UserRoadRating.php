<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserRoadRating extends Model
{
    protected $table = 'user_road_ratings';

    protected $fillable = [
        'road_rating_id',
        'user_id',
        'road_condition',
        'traffic',
        'facilities',
        'safety_index',
        'scenic_value',
    ];

    protected $casts = [
        'road_condition' => 'float',
        'traffic' => 'float',
        'facilities' => 'float',
        'safety_index' => 'float',
        'scenic_value' => 'float',
    ];

    public function roadRating(): BelongsTo
    {
        return $this->belongsTo(RoadRating::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
