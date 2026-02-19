<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoadRatingComment extends Model
{
    use HasUuids;
    protected $table = 'road_rating_comments';

    protected $fillable = [
        'road_rating_id',
        'user_id',
        'parent_id',
        'content',
        'abuse_reported',
    ];

    public function roadRating(): BelongsTo
    {
        return $this->belongsTo(RoadRating::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(RoadRatingComment::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(RoadRatingComment::class, 'parent_id');
    }
}
