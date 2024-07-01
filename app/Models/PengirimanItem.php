<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class PengirimanItem extends Model {
    use Uuid;
    protected $fillable = ['pengiriman_id', 'produk_id', 'resi', 'kuantitas'];

    public function pengiriman() {
        return $this->belongsTo(Pengiriman::class);
    }

    public function produk() {
        return $this->belongsTo(Produk::class);
    }
}
