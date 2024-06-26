<?php

namespace App\Http\Controllers;

use App\Http\Requests\TarifKurirRequest;
use App\Models\TarifKurir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TarifKurirController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = TarifKurir::with(['to_province', 'to_city', 'to_district'])->where(function ($q) use ($request) {
            $q->where('keterangan', 'LIKE', "%$request->search%");
            $q->orWhereHas('to_province', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('to_city', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('to_district', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%$request->search%");
            });
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show() {
        return response()->json(TarifKurir::get());
    }

    public function store(TarifKurirRequest $request) {
        $body = $request->validated();

        $data = TarifKurir::create($body);
        foreach ($body['items'] as $item) {
            $data->items()->create($item);
        }

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = TarifKurir::with(['items'])->where('uuid', $uuid)->first();
        return response()->json($data);
    }

    public function update(TarifKurirRequest $request, $uuid) {
        $body = $request->validated();

        $data = TarifKurir::findByUuid($uuid);
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
        $data = TarifKurir::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
