<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model {
    use Uuid;
    protected $fillable = ['pengiriman_id', 'nominal', 'catatan', 'tanggal'];

    public function pengiriman() {
        return $this->belongsTo(Pengiriman::class);
    }
}
