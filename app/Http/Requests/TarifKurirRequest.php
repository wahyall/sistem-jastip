<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TarifKurirRequest extends FormRequest {
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
            'to_province_code' => 'required|numeric',
            'to_city_code' => 'required|numeric',
            'to_district_code' => 'required|numeric',
            'keterangan' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.from_berat' => 'required|numeric',
            'items.*.to_berat' => 'nullable|numeric',
            'items.*.nominal' => 'required|numeric',
        ];
    }
}
