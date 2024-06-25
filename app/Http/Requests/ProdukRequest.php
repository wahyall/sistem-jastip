<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProdukRequest extends FormRequest {
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
            'gambar' => 'required|image',
            'nama' => 'required|string',
            'deskripsi' => 'required|string',
            'berat' => 'required|numeric',
            'satuan_berat_id' => 'required|numeric',
            'satuan_volume_id' => 'required|numeric',
            'volume_p' => 'required|numeric',
            'volume_l' => 'required|numeric',
            'volume_t' => 'required|numeric',
        ];
    }
}
