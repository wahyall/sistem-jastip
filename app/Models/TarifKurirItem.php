<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class TarifKurirItem extends Model {
    use Uuid;
    protected $fillable = ['tarif_kurir_id', 'from_berat', 'to_berat', 'nominal'];

    public function tarif_kurir() {
        return $this->belongsTo(TarifKurir::class);
    }
}
