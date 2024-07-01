<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\Uuid;

class User extends Authenticatable {
    use HasApiTokens, Uuid;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'password', 'address', 'phone', 'photo', 'bio', 'gender', 'role', 'cabang_id'];
    protected $appends = ['photo_url'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token', 'created_at', 'updated_at'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [];

    public function getPhotoUrlAttribute() {
        if (!isset($this->photo)) return asset('assets/media/avatars/blank.png');
        else return asset($this->photo);
    }

    public function cabang() {
        // Untuk Kurir
        return $this->belongsTo(User::class, 'cabang_id');
    }

    public function alamats() {
        // Untuk Custoemr
        return $this->hasOne(Alamat::class);
    }
}
