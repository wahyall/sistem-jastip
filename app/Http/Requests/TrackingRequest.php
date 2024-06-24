<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackingRequest extends FormRequest {
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
            'pengiriman_id' => 'required|numeric',
            'status' => 'required|string',
            'tanggal' => 'required|date',
            'jam' => 'required|string',
            'catatan' => 'nullable|string',
            'kurir_id' => 'nullable|numeric',
            'foto' => 'nullable|image'
        ];
    }
}
