<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrackingRequest;
use App\Models\Pengiriman;
use App\Models\Tracking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TrackingController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = Pengiriman::with(['satuan', 'cabang', 'kategori', 'pengirim.city', 'penerima.city', 'layanan'])->where(function ($q) use ($request) {
            $q->where('resi', 'LIKE', "%$request->search%");
            $q->orWhere('status', 'LIKE', "%$request->search%");
            $q->orWhere('total_berat', 'LIKE', "%$request->search%");
            $q->orWhere('total_koli', 'LIKE', "%$request->search%");
            $q->orWhere('catatan', 'LIKE', "%$request->search%");
            $q->orWhereHas('satuan', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('cabang', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('pengirim', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
                $q->orWhereHas('city', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%$request->search%");
                });
            });
            $q->orWhereHas('penerima', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
                $q->orWhereHas('city', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%$request->search%");
                });
            });
            $q->orWhereHas('layanan', function ($q) use ($request) {
                $q->where('nama', 'LIKE', "%$request->search%");
            });
            $q->orWhereHas('trackings', function ($q) use ($request) {
                $q->whereHas('kurir', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%$request->search%");
                });
            });
        })->when(str_contains($request->range, "to"), function ($q) use ($request) {
            $range = explode(" to ", $request->range);
            $q->whereBetween('tanggal_kirim', $range);
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->when(auth()->user()->role == 'cabang', function ($q) {
            $q->where('cabang_id', auth()->user()->id);
        })->when(auth()->user()->role == 'kurir', function ($q) {
            $q->whereHas('trackings', function ($q) {
                $q->where('kurir_id', auth()->user()->id);
            });
        })->when($request->status, function ($q) use ($request) {
            $q->where('status', $request->status);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        $data->map(function ($a) {
            $a->kurir = @$a->trackings()->where('kurir_id', '!=', NULL)->first()->kurir;
        });

        return response()->json($data);
    }

    public function show() {
        return response()->json(Tracking::get());
    }

    public function store(TrackingRequest $request) {
        $body = $request->validated();

        if ($request->foto) {
            $body['foto'] = 'storage/' . $request->foto->store('tracking', 'public');
        }

        if (auth()->user()->role == 'kurir') {
            $body['kurir_id'] = auth()->user()->id;
        }

        $data = Tracking::create($body);
        $data->pengiriman->updateStatusTracking();

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = Pengiriman::with(['trackings.kurir', 'cabang'])->where('uuid', $uuid)->first();
        return response()->json($data);
    }

    public function update(TrackingRequest $request, $uuid) {
        $body = $request->validated();

        $data = Tracking::findByUuid($uuid);
        $data->update($body);
        $data->pengiriman->updateStatusTracking();

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = Tracking::findByUuid($uuid);
        $data->delete();
        $data->pengiriman->updateStatusTracking();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }

    public function  cekResi(Request $request) {
        $data = Pengiriman::with(['trackings.kurir', 'cabang', 'penerima.city', 'pengirim.city'])->where('resi', $request->resi)->first();

        if ($data) {
            return response()->json($data);
        }

        return response()->json([
            'message' => 'Resi Pengiriman tidak ditemukan'
        ], 404);
    }
}
