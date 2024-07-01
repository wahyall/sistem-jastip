<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use KodePandai\Indonesia\Models\City;
use KodePandai\Indonesia\Models\District;
use KodePandai\Indonesia\Models\Province;

class Alamat extends Model {
    use Uuid;
    protected $fillable = ['user_id', 'penerima', 'telepon', 'tandai', 'province_code', 'city_code', 'district_code', 'detail_alamat', 'kode_pos'];
    protected $with = ['province', 'city', 'district'];

    public function province() {
        return $this->belongsTo(Province::class, 'province_code');
    }

    public function city() {
        return $this->belongsTo(City::class, 'city_code');
    }

    public function district() {
        return $this->belongsTo(District::class, 'district_code');
    }
}
