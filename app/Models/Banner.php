<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model {
    use Uuid;
    protected $fillable = ['image', 'url'];
    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        if (!isset($this->image)) return asset('assets/media/avatars/blank.png');
        else return asset($this->image);
    }
}
