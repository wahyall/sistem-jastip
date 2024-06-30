<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProdukImage extends Model {
    protected $fillable = ['produk_id', 'image'];
    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        if (!isset($this->image)) return asset('assets/media/avatars/blank.png');
        else return asset($this->image);
    }
}
