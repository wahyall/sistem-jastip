<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;

class Tracking extends Model {
    use Uuid;
    protected $fillable = ['pengiriman_id', 'status', 'tanggal', 'jam', 'catatan', 'kurir_id', 'foto'];
    protected $with = ['kurir'];
    protected $appends = ['tanggal_indo', 'hari_indo'];

    public function pengiriman() {
        return $this->belongsTo(Pengiriman::class);
    }

    public function kurir() {
        return $this->belongsTo(User::class, 'kurir_id');
    }

    public function getTanggalIndoAttribute() {
        return date_indo($this->tanggal);
    }

    public function getHariIndoAttribute() {
        return explode(',', date_indo($this->tanggal, true))[0];
    }
}
