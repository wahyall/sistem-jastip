<?php

namespace App\Http\Controllers;

use App\Http\Requests\KomplainRequest;
use App\Http\Requests\UpdateKomplainRequest;
use App\Models\Komplain;
use App\Models\Pengiriman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KomplainController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = Komplain::with(['pengiriman.penerima'])->where(function ($q) use ($request) {
            $q->where('catatan', 'LIKE', "%$request->search%");
            $q->orWhere('jenis', 'LIKE', "%$request->search%");
            $q->orWhereHas('pengiriman', function ($q) use ($request) {
                $q->where('resi', 'LIKE', "%$request->search%");
                $q->orWhere('tanggal_terima', 'LIKE', "%$request->search%");
                $q->orWhereHas('penerima', function ($q) use ($request) {
                    $q->where('nama', 'LIKE', "%$request->search%");
                });
            });
        })->when(str_contains($request->range, "to"), function ($q) use ($request) {
            $range = explode(" to ", $request->range);
            $q->whereBetween('created_at', $range);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show() {
        return response()->json(Komplain::get());
    }

    public function store(KomplainRequest $request) {
        $body = $request->validated();
        $pengiriman = Pengiriman::where('resi', $request->resi)->first();

        if (!$pengiriman) {
            return response()->json([
                'message' => 'Resi Pengiriman tidak ditemukan'
            ], 404);
        }

        $body['pengiriman_id'] = $pengiriman->id;
        $body['jenis'] = 'Klaim Barang Rusak';

        if ($request->attachment) {
            $body['attachment'] = 'storage/' . $request->attachment->store('klaim', 'public');
        }

        Komplain::create($body);

        return response()->json([
            'message' => 'Berhasil mengajukan Klaim Barang Rusak',
        ]);
    }

    public function edit($uuid) {
        $data = Komplain::with(['pengiriman'])->where('uuid', $uuid)->first();
        return response()->json($data);
    }

    public function update(UpdateKomplainRequest $request, $uuid) {
        $body = $request->validated();

        $data = Komplain::findByUuid($uuid);
        $data->update($body);

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = Komplain::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
