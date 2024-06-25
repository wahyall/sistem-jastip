<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class OpsiPengirimanItem extends Model {
    use Uuid;
    protected $fillable = ['opsi_pengiriman_id', 'tipe', 'from_berat', 'to_berat', 'nominal', 'volume', 'satuan_barang_id'];

    public function opsi_pengiriman() {
        return $this->belongsTo(OpsiPengiriman::class);
    }

    public function satuan() {
        return $this->belongsTo(SatuanBarang::class);
    }
}
