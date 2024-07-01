<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Pengiriman extends Model {
    use Uuid;
    protected $fillable = [
        'resi', 'customer_id', 'alamat_id', 'status',
        'tanggal_kirim', 'tanggal_terima', 'catatan',
        'opsi_pengiriman_id',
        'harga_ekspedisi', 'tarif_kurir_item_id', 'status_bayar', 'tipe_kurir'
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

    // public function cabang() {
    //     return $this->belongsTo(User::class, 'cabang_id');
    // }

    public function customer() {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function opsi_pengiriman() {
        return $this->belongsTo(OpsiPengiriman::class);
    }

    // public function opsi_pengiriman_item() {
    //     return $this->belongsTo(OpsiPengirimanItem::class);
    // }

    public function tarif_kurir_item() {
        return $this->belongsTo(TarifKurirItem::class);
    }

    public function trackings() {
        return $this->hasMany(Tracking::class);
    }

    public function pembayarans() {
        return $this->hasMany(Pembayaran::class);
    }

    public function items() {
        return $this->hasMany(PengirimanItem::class);
    }

    public static function genResi() {
        // Format = KDC20240806001
        $resi = 'KDC';
        $last = Pengiriman::where('created_at', date('Y-m-d'))->orderBy('resi', 'DESC')->first();

        if (!$last) {
            $resi .= date('Y');
            $resi .= date('m');
            $resi .= date('d');
            $resi .= str_pad(1, 3, 0, STR_PAD_LEFT);

            return $resi;
        } else {
            $nomor = (int)substr($last->resi, 11) + 1;
            $nomor = str_pad($nomor, 3, 0, STR_PAD_LEFT);

            $resi .= date('Y');
            $resi .= date('m');
            $resi .= date('d');
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
