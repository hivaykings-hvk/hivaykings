<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoadRatingComment extends Model
{
    use HasUuids;
    protected $table = 'road_rating_comments';

    protected $fillable = [
        'road_rating_id',
        'user_id',
        'content',
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
