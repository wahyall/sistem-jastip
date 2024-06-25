<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OpsiPengirimanRequest extends FormRequest {
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
            'nama' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.tipe' => 'required|string|in:berat,volume',
            'items.*.from_berat' => 'nullable|numeric',
            'items.*.to_berat' => 'nullable|numeric',
            'items.*.volume' => 'nullable|numeric',
            'items.*.satuan_barang_id' => 'required|numeric',
            'items.*.nominal' => 'required|numeric',
        ];
    }
}
