<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommentLike extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'comment_likes';

    protected $fillable = [
        'comment_id',
        'user_id',
    ];

    public $timestamps = true;

    public function comment(): BelongsTo
    {
        return $this->belongsTo(QuestionComment::class, 'comment_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
