<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PengirimanRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize() {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules() {
        return [
            'cabang_id' => 'nullable|numeric',
            'pengirim_id' => 'required|numeric',
            'penerima_id' => 'required|numeric',

            'tanggal_kirim' => 'nullable|date',
            'tanggal_terima' => 'nullable|date',

            'kategori_barang_id' => 'required|numeric',
            'satuan_barang_id' => 'required|numeric',
            'total_berat' => 'required|numeric',
            'total_koli' => 'required|numeric',
            'detail_barang' => 'nullable|string',
            'catatan' => 'nullable|string',

            'layanan_ongkir_id' => 'required|numeric',
            'total_ongkir' => 'required|numeric',
            'biaya_tambahan' => 'nullable|numeric',
            'keterangan_biaya_tambahan' => 'nullable|string',
            'jenis_pembayaran_id' => 'required|numeric',
        ];
    }
}
