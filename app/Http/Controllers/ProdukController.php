<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProdukRequest;
use App\Models\OpsiPengiriman;
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

        $data = Produk::create($body);
        foreach ($body['images'] as $file) {
            $image = 'storage/' . $file->store('produk', 'public');
            $data->images()->create(['image' => $image]);
        }

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = Produk::findByUuid($uuid);
        return response()->json($data);
    }

    public function detail($uuid) {
        $data = Produk::with(['satuan_berat', 'satuan_volume'])->where('uuid', $uuid)->first();
        return response()->json($data);
    }

    public function update(ProdukRequest $request, $uuid) {
        $body = $request->validated();

        $data = Produk::findByUuid($uuid);

        if ($request->gambar) {
            foreach ($data->images as $image) {
                if (is_file(storage_path('app/public/' . str_replace('storage/', '', $image->image)))) {
                    unlink(storage_path('app/public/' . str_replace('storage/', '', $image->image)));
                }
            }
        }

        $data->update($body);
        foreach ($body['images'] as $file) {
            $image = 'storage/' . $file->store('produk', 'public');
            $data->images()->create(['image' => $image]);
        }

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

    public function estimasiHarga(Request $request) {
        $opsi = OpsiPengiriman::with(['items'])->get()->map(function ($a) use ($request) {
            // Berat
            $items = $a->items->where('satuan_barang_id', $request->satuan_berat_id);
            if (count($items)) {
                $item = $items->filter(function ($i) use ($request) {
                    if ($i->to_berat) return $i->from_berat < $request->berat && $i->to_berat >= $request->berat;
                    else return $i->from_berat < $request->berat;
                })->first();

                if ($item) {
                    $a->harga_berat = $request->berat * $item->nominal;
                }
            }

            // Volume
            $item = $a->items->where('satuan_barang_id', $request->satuan_volume_id)->first();
            if ($item) {
                $a->harga_volume = $request->volume * $item->nominal;
            }

            $a->makeHidden(['items']);
            return $a;
        });
        return $opsi;
    }
}
