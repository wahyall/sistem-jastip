<?php

namespace App\Http\Controllers;

use App\Http\Requests\SatuanBarangRequest;
use App\Models\SatuanBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SatuanBarangController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = SatuanBarang::where(function ($q) use ($request) {
            $q->where('nama', 'LIKE', "%$request->search%");
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show() {
        return response()->json(SatuanBarang::get());
    }

    public function store(SatuanBarangRequest $request) {
        $body = $request->validated();

        SatuanBarang::create($body);

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = SatuanBarang::findByUuid($uuid);
        return response()->json($data);
    }

    public function update(SatuanBarangRequest $request, $uuid) {
        $body = $request->validated();

        $data = SatuanBarang::findByUuid($uuid);
        $data->update($body);

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = SatuanBarang::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
