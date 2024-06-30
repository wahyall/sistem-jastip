<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model {
    use Uuid;
    protected $fillable = ['user_id', 'produk_id', 'opsi_pengiriman_id', 'kuantitas'];
    protected $appends = ['harga'];
    protected $with = ['produk', 'opsi_pengiriman'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function produk() {
        return $this->belongsTo(Produk::class);
    }

    public function opsi_pengiriman() {
        return $this->belongsTo(OpsiPengiriman::class);
    }

    public function getHargaAttribute() {
        $opsi = $this->produk->opsi_harga_pengiriman->first(function ($a) {
            return $a->id == $this->opsi_pengiriman_id;
        });

        if ($this->produk->opsi_harga == "berat") return $opsi->harga_berat;
        if ($this->produk->opsi_harga == "volume") return $opsi->harga_volume;
    }
}
