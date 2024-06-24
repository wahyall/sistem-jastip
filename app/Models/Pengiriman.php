<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Pengiriman extends Model {
    use Uuid;
    protected $fillable = [
        'resi', 'cabang_id', 'customer_id', 'alamat_id', 'status',
        'tanggal_kirim', 'tanggal_terima', 'catatan',
        'harga_ekspedisi', 'tarif_ongkir_item_id', 'status_bayar'
    ];
    protected $appends = ['pembayaran'];

    public function scopeAuthor(Builder $query) {
        $query->when(auth()->user()->role == 'cabang', function ($q) {
            $q->where('cabang_id', auth()->user()->id);
        })->when(auth()->user()->role == 'kurir', function ($q) {
            $q->whereHas('trackings', function ($q) {
                $q->where('kurir_id', auth()->user()->id);
            });
        });
    }

    public function cabang() {
        return $this->belongsTo(User::class, 'cabang_id');
    }

    public function customer() {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function trackings() {
        return $this->hasMany(Tracking::class);
    }

    public function pembayarans() {
        return $this->hasMany(Pembayaran::class);
    }

    public static function genResi() {
        $resi = 'S';
        $last = Pengiriman::whereYear('created_at', date('Y'))->whereMonth('created_at', date('m'))->orderBy('resi', 'DESC')->first();

        if (!$last) {
            $resi .= date('Y');
            $resi .= date('m');
            $resi .= str_pad(1, 5, 0, STR_PAD_LEFT);

            return $resi;
        } else {
            $nomor = (int)substr($last->resi, 7) + 1;
            $nomor = str_pad($nomor, 5, 0, STR_PAD_LEFT);

            $resi .= date('Y');
            $resi .= date('m');
            $resi .= $nomor;

            return $resi;
        }
    }

    public function updateStatusTracking() {
        $tracking = $this->trackings()->orderBy('id', 'DESC')->first();

        $body = ['status' => $tracking->status];
        if ($tracking->status == 'Delivered') {
            $body['tanggal_terima'] = date('Y-m-d');
        }

        $this->update($body);
    }

    public function updateStatusBayar() {
        if ($this->getPembayaranAttribute()['status']) {
            $this->update(['status_bayar' => 'Lunas']);
        } else {
            $this->update(['status_bayar' => 'Belum Lunas']);
        }
    }

    public function getPembayaranAttribute() {
        $tagihan = $this->total_ongkir + $this->biaya_tambahan;
        $dibayarkan = $this->pembayarans()->sum('nominal');
        $piutang = $tagihan - $dibayarkan;
        $status = $piutang <= 0;

        return compact('tagihan', 'dibayarkan', 'piutang', 'status');
    }
}
