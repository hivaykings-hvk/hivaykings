<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionComment extends Model
{
    use HasFactory;

    protected $table = 'question_comments';

    protected $fillable = [
        'question_id',
        'user_id',
        'parent_id',
        'content',
        'likes_count',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(CommentLike::class, 'comment_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(QuestionComment::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(QuestionComment::class, 'parent_id');
    }

    public function isLikedBy(User $user): bool
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function likeCount(): int
    {
        return $this->likes()->count();
    }
}
