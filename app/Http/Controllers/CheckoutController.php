<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use App\Models\Keranjang;
use App\Models\OpsiPengiriman;
use App\Models\OpsiPengirimanItem;
use App\Models\Pengiriman;
use App\Models\TarifKurir;
use App\Models\TarifKurirItem;
use Illuminate\Http\Request;

class CheckoutController extends Controller {
    private function hargaEkspedisi($opsiPengirimanId, $data) {
        $opsi = OpsiPengiriman::find($opsiPengirimanId);

        // Berat
        $items = $opsi->items->where('satuan_barang_id', $data['satuan_berat_id']);
        if (count($items)) {
            $item = $items->filter(function ($i) use ($data) {
                if ($i->to_berat) return $i->from_berat < $data['berat'] && $i->to_berat >= $data['berat'];
                else return $i->from_berat < $data['berat'];
            })->first();

            if ($item) {
                $opsi->harga_berat = $data['berat'] * $item->nominal;
            }
        }

        // Volume
        $item = $opsi->items->where('satuan_barang_id', $data['satuan_volume_id'])->first();
        if ($item) {
            $opsi->harga_volume = $data['volume'] * $item->nominal;
        }

        return $opsi;
    }

    public function post(Request $request) {
        $body = $request->validate([
            'selected' => 'required|array|min:1',
            'tipe_kurir' => 'required|string|in:standar,ambil',
        ]);

        $alamat = Alamat::where('user_id', auth()->user()->id)->first();

        $totalBerat = 0;
        $keranjangs = Keranjang::whereIn('id', $body['selected'])->get();
        foreach ($keranjangs as $keranjang) {
            $totalBerat += $keranjang->produk->berat * $keranjang->kuantitas;
        }

        $tarif = null;
        if ($body['tipe_kurir'] == 'standar') {
            $tarifs = TarifKurirItem::whereHas('tarif_kurir', function ($q) use ($body, $alamat) {
                $q->where('to_district_code', $alamat->district_code);
            })->get();
            foreach ($tarifs as $i => $item) {
                if ($item->from_berat < $totalBerat && $item->to_berat >= $totalBerat) $tarif = $item;
                else if ($i == count($tarifs) - 1 && $item->from_berat < $totalBerat) $tarif = $item;
            }
        }

        $hargaEkspedisi = 0;
        foreach ($keranjangs as $keranjang) {
            $opsi = $this->hargaEkspedisi($keranjang->opsi_pengiriman_id, [
                'satuan_berat_id' => $keranjang->produk->satuan_berat_id,
                'satuan_volume_id' => $keranjang->produk->satuan_volume_id,
                'volume' => $keranjang->kuantitas * $keranjang->produk->volume,
                'berat' => $keranjang->kuantitas * $keranjang->produk->berat,
            ]);
            if ($keranjang->produk->opsi_harga == "berat") $hargaEkspedisi += $opsi->harga_berat;
            else if ($keranjang->produk->opsi_harga == "volume") $hargaEkspedisi += $opsi->harga_volume;
        }

        $body['resi'] = Pengiriman::genResi();
        $body['opsi_pengiriman_id'] = $keranjangs[0]->opsi_pengiriman_id;
        $body['customer_id'] = auth()->user()->id;
        // $body['alamat_id'] = $alamat->id;
        $body['harga_ekspedisi'] = $hargaEkspedisi;

        if ($body['tipe_kurir'] == 'standar') {
            $body['tarif_kurir_item_id'] = $tarif->id;
        }
        $body['status'] = 'Menunggu Pembayaran';

        $data = Pengiriman::create($body);
        foreach ($keranjangs as $i => $keranjang) {
            $data->items()->create([
                'resi' => $data->resi . '-' . chr(65 + $i),
                'produk_id' => $keranjang->produk_id,
                'kuantitas' => $keranjang->kuantitas,
            ]);
        }

        Keranjang::whereIn('id', $body['selected'])->delete();

        return response()->json($data);
    }
}
