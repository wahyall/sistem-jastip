<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AlamatRequest extends FormRequest {
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
            'penerima' => 'required|string',
            'telepon' => 'required|string',
            'detail_alamat' => 'required|string',
            'kode_pos' => 'required|string',
            'province_code' => 'required|numeric',
            'city_code' => 'required|numeric',
            'district_code' => 'required|numeric',
            'tandai' => 'required|string|in:kantor,rumah',
        ];
    }
}
