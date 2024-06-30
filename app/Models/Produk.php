<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model {
    use Uuid;
    protected $fillable = ['nama', 'gambar', 'deskripsi', 'berat', 'satuan_berat_id', 'volume_p', 'volume_l', 'volume_t', 'satuan_volume_id', 'opsi_harga'];
    protected $with = ['images'];
    protected $appends = ['thumbnail', 'images_url', 'volume', 'opsi_harga_pengiriman'];

    public function satuan_berat() {
        return $this->belongsTo(SatuanBarang::class, 'satuan_berat_id');
    }

    public function satuan_volume() {
        return $this->belongsTo(SatuanBarang::class, 'satuan_volume_id');
    }

    public function images() {
        return $this->hasMany(ProdukImage::class);
    }

    public function getThumbnailAttribute() {
        return asset($this->images[0]->image);
    }

    public function getImagesUrlAttribute() {
        return $this->images->map(function ($a) {
            return $a->image;
        });
    }

    public function getVolumeAttribute() {
        return $this->volume_p * $this->volume_l * $this->volume_t;
    }

    public function getOpsiHargaPengirimanAttribute() {
        $opsi = OpsiPengiriman::with(['items'])->get()->map(function ($a) {
            // Berat
            $items = $a->items->where('satuan_barang_id', $this->satuan_berat_id);
            if (count($items)) {
                $item = $items->filter(function ($i) {
                    if ($i->to_berat) return $i->from_berat < $this->berat && $i->to_berat >= $this->berat;
                    else return $i->from_berat < $this->berat;
                })->first();

                if ($item) {
                    $a->harga_berat = $this->berat * $item->nominal;
                }
            }

            // Volume
            $item = $a->items->where('satuan_barang_id', $this->satuan_volume_id)->first();
            if ($item) {
                $a->harga_volume = $this->volume * $item->nominal;
            }

            $a->makeHidden(['items']);
            return $a;
        });
        return $opsi;
    }
}
