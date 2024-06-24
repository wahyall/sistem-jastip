<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Komplain extends Model {
    use Uuid;
    protected $fillable = ['pengiriman_id', 'catatan', 'catatan_admin', 'attachment', 'jenis', 'status'];
    protected $appends = ['tanggal'];

    public function pengiriman() {
        return $this->belongsTo(Pengiriman::class);
    }

    public function getTanggalAttribute() {
        return Carbon::parse($this->created_at)->format('Y-m-d');
    }
}
