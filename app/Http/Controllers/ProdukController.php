<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProdukRequest;
use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdukController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = Produk::with(['satuan_berat', 'satuan_volume'])->where(function ($q) use ($request) {
            $q->where('nama', 'LIKE', "%$request->search%");
            $q->orWhere('deskripsi', 'LIKE', "%$request->search%");
            $q->orWhereHas('satuan_berat', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('satuan_volume', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
            });
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show(Request $request) {
        return response()->json(Produk::get());
    }

    public function store(ProdukRequest $request) {
        $body = $request->validated();

        if ($request->gambar) {
            $body['gambar'] = 'storage/' . $request->gambar->store('produk', 'public');
        }

        Produk::create($body);

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = Produk::findByUuid($uuid);
        return response()->json($data);
    }

    public function update(ProdukRequest $request, $uuid) {
        $body = $request->validated();

        $data = Produk::findByUuid($uuid);

        if ($request->gambar) {
            // Delete old gambar
            if (is_file(storage_path('app/public/' . str_replace('storage/', '', $data->gambar)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $data->gambar)));
            }
            $body['gambar'] = 'storage/' . $request->gambar->store('produk', 'public');
        }

        $data->update($body);

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = Produk::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
