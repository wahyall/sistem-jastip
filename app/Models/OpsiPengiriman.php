<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class OpsiPengiriman extends Model {
    use Uuid;
    protected $fillable = ['nama'];

    public function items() {
        return $this->hasMany(OpsiPengirimanItem::class, 'opsi_pengiriman_id');
    }
}
