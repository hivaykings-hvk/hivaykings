<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TravelogueComment extends Model
{
    /** @use HasFactory<\Database\Factories\TravelogueCommentFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'travelogue_id',
        'user_id',
        'parent_id',
        'content',
        'abuse_reported',
    ];

    protected $casts = [
        'abuse_reported' => 'boolean',
    ];

    public function travelogue(): BelongsTo
    {
        return $this->belongsTo(Travelogue::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(TravelogueComment::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(TravelogueComment::class, 'parent_id');
    }
}
