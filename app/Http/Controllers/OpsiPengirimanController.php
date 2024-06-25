<?php

namespace App\Http\Controllers;

use App\Http\Requests\OpsiPengirimanRequest;
use App\Models\OpsiPengiriman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OpsiPengirimanController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = OpsiPengiriman::where(function ($q) use ($request) {
            $q->where('nama', 'LIKE', "%$request->search%");
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show() {
        return response()->json(OpsiPengiriman::get());
    }

    public function store(OpsiPengirimanRequest $request) {
        $body = $request->validated();

        $data = OpsiPengiriman::create($body);
        foreach ($body['items'] as $item) {
            $data->items()->create($item);
        }

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = OpsiPengiriman::with(['items'])->where('uuid', $uuid)->first();
        return response()->json($data);
    }

    public function update(OpsiPengirimanRequest $request, $uuid) {
        $body = $request->validated();

        $data = OpsiPengiriman::findByUuid($uuid);
        $data->update($body);

        $data->items()->delete();
        foreach ($body['items'] as $item) {
            $data->items()->create($item);
        }

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = OpsiPengiriman::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
