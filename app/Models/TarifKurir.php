<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use KodePandai\Indonesia\Models\City;
use KodePandai\Indonesia\Models\Province;

class TarifKurir extends Model {
    use Uuid;
    protected $fillable = ['to_province_code', 'to_city_code', 'keterangan'];

    public function to_province() {
        return $this->belongsTo(Province::class, 'to_province_code');
    }

    public function to_city() {
        return $this->belongsTo(City::class, 'to_city_code');
    }

    public function items() {
        return $this->hasMany(TarifKurirItem::class);
    }
}
