<?php

namespace App\Http\Controllers;

use App\Http\Requests\BannerRequest;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = Banner::where(function ($q) use ($request) {
            $q->where('url', 'LIKE', "%$request->search%");
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show(Request $request) {
        return response()->json(Banner::when(isset($request->role), function ($q) use ($request) {
            $q->where('role', $request->role);

            if ($request->cabang_id) {
                $q->where('cabang_id', $request->cabang_id);
            }
        })->get());
    }

    public function store(BannerRequest $request) {
        $body = $request->validated();

        if ($request->image) {
            $body['image'] = 'storage/' . $request->image->store('banner', 'public');
        }

        Banner::create($body);

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = Banner::findByUuid($uuid);
        return response()->json($data);
    }

    public function update(BannerRequest $request, $uuid) {
        $body = $request->validated();

        $data = Banner::findByUuid($uuid);

        if ($request->image) {
            // Delete old image
            if (is_file(storage_path('app/public/' . str_replace('storage/', '', $data->image)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $data->image)));
            }
            $body['image'] = 'storage/' . $request->image->store('banner', 'public');
        }

        $data->update($body);

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = Banner::findByUuid($uuid);
        $data->delete();
        if (is_file(storage_path('app/public/' . str_replace('storage/', '', $data->image)))) {
            unlink(storage_path('app/public/' . str_replace('storage/', '', $data->image)));
        }

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
