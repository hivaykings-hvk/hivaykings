<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'title',
        'username',
        'email',
        'phone',
        'phone_verified',
        'city',
        'state',
        'country',
        'pincode',
        'password',
        'image_path',
        'bio',
        'subscribe_newsletter',
        'email_verified_at',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified' => 'boolean',
            'subscribe_newsletter' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function hasRole($role)
    {
        if (is_array($role)) {
            return in_array($this->role, $role);
        }

        return $this->role === $role;
    }

    public function hasAnyRole($roles)
    {
        return in_array($this->role, (array) $roles);
    }

    public function hasAllRoles($roles)
    {
        return $this->hasRole($roles);
    }

    public function assignRole($role)
    {
        $this->update(['role' => $role]);
        return $this;
    }

    public function removeRole($role)
    {
        if ($this->role === $role) {
            $this->update(['role' => 'user']);
        }
        return $this;
    }
}
