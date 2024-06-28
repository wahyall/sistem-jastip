<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use Illuminate\Http\Request;

class KeranjangController extends Controller {
    public function index() {
        return response()->json(Keranjang::with(['produk', 'opsi_pengiriman'])->where('user_id', auth()->user()->id)->get());
    }

    public function store(Request $request) {
        $body = $request->validate([
            'produk_id' => 'required|numeric',
            'opsi_pengiriman_id' => 'required|numeric',
        ]);
        $body['user_id'] = auth()->user()->id;

        $data = Keranjang::where('user_id', auth()->user()->id)->where('produk_id', $request->produk_id)->first();
        if ($data) {
            $data->update(['kuantitas' => $data->kuantitas + 1]);
        } else {
            $data = Keranjang::create($body);
        }

        return response()->json([
            'message' => 'Produk berhasil ditambahakan ke Keranjang'
        ]);
    }
}
