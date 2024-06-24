<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model {
    use Uuid;
    protected $fillable = ['nama', 'gambar', 'deskripsi', 'berat', 'satuan_barang_id', 'volume_p', 'volume_l', 'volume_t'];

    public function satuan() {
        return $this->belongsTo(SatuanBarang::class);
    }
}
