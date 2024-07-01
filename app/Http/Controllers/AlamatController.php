<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlamatRequest;
use App\Models\Alamat;
use App\Models\TarifKurir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AlamatController extends Controller {
    public function index() {
        $data = Alamat::where('user_id', auth()->user()->id)->first();
        $data->tarif = TarifKurir::with(['items'])->where('to_district_code', $data->district_code)->first();

        return response()->json($data);
    }

    public function store(AlamatRequest $request) {
        $body = $request->validated();
        $body['user_id'] = auth()->user()->id;

        $data = Alamat::where('user_id', auth()->user()->id)->first();
        if ($data) $data->update($body);
        else Alamat::create($body);

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function update(AlamatRequest $request, $uuid) {
        $body = $request->validated();

        $data = Alamat::findByUuid($uuid);
        $data->update($body);

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = Alamat::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
