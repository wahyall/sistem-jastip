<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequestStore;
use App\Http\Requests\UserRequestUpdate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller {
    public function paginate(Request $request) {
        $per = (($request->per) ? $request->per : 10);
        $page = (($request->page) ? $request->page - 1 : 0);

        DB::statement(DB::raw('set @nomor=0+' . $page * $per));
        $data = User::with(['cabang'])->where(function ($q) use ($request) {
            $q->where('name', 'LIKE', "%$request->search%");
            $q->orWhere('email', 'LIKE', "%$request->search%");
            $q->orWhere('phone', 'LIKE', "%$request->search%");
            $q->orWhere('address', 'LIKE', "%$request->search%");

            if ($request->kurir) {
                $q->orWhereHas('cabang', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%$request->search%");
                });
            }
        })->when(isset($request->role), function ($q) use ($request) {
            $q->where('role', $request->role);
        })->paginate($per, ['*', DB::raw('@nomor  := @nomor  + 1 AS nomor')]);

        return response()->json($data);
    }

    public function show(Request $request) {
        return response()->json(User::when(isset($request->role), function ($q) use ($request) {
            $q->where('role', $request->role);

            if ($request->cabang_id) {
                $q->where('cabang_id', $request->cabang_id);
            }
        })->get());
    }

    public function store(UserRequestStore $request) {
        $body = $request->validated();

        $body['password'] = bcrypt($body['password']);

        if ($request->photo) {
            $body['photo'] = 'storage/' . $request->photo->store('user', 'public');
        }

        User::create($body);

        return response()->json([
            'message' => 'Berhasil menambahkan data',
        ]);
    }

    public function edit($uuid) {
        $data = User::findByUuid($uuid);
        return response()->json($data);
    }

    public function update(UserRequestUpdate $request, $uuid) {
        $body = $request->validated();

        $data = User::findByUuid($uuid);

        $body['password'] = bcrypt($body['password']);

        if ($request->photo) {
            // Delete old photo
            if (is_file(storage_path('app/public/' . str_replace('storage/', '', $data->photo)))) {
                unlink(storage_path('app/public/' . str_replace('storage/', '', $data->photo)));
            }
            $body['photo'] = 'storage/' . $request->photo->store('user', 'public');
        }

        $data->update($body);

        return response()->json([
            'message' => 'Berhasil memperbarui data',
        ]);
    }

    public function destroy($uuid) {
        $data = User::findByUuid($uuid);
        $data->delete();

        return response()->json([
            'message' => 'Berhasil menghapus data',
        ]);
    }
}
