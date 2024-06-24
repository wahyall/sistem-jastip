<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model {
    use Uuid;
    protected $fillable = ['user_id', 'produk_id', 'opsi_pengiriman_id', 'kuantitas'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function produk() {
        return $this->belongsTo(Produk::class);
    }

    public function opsi_pengiriman() {
        return $this->belongsTo(OpsiPengiriman::class);
    }
}
