<?php

namespace Database\Seeders;

use App\Models\OpsiPengiriman;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OpsiPengirimanSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('opsi_pengirimen')->delete();

        $pesawat = OpsiPengiriman::create(['nama' => 'Pesawat']);
        $pesawat->items()->create(['tipe' => 'berat', 'from_berat' => 100, 'nominal' => 9500, 'satuan_barang_id' => 3]);
        $pesawat->items()->create(['tipe' => 'berat', 'from_berat' => 1, 'nominal' => 95000, 'satuan_barang_id' => 2]);
        $pesawat->items()->create(['tipe' => 'volume', 'volume' => 1, 'nominal' => 5000, 'satuan_barang_id' => 1]);

        $kapal = OpsiPengiriman::create(['nama' => 'Kapal']);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 0, 'to_berat' => 3, 'nominal' => 40000, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 3, 'to_berat' => 6, 'nominal' => 35000, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 6, 'to_berat' => 10, 'nominal' => 30000, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 10, 'to_berat' => 20, 'nominal' => 26000, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 20, 'to_berat' => 30, 'nominal' => 21000, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 30, 'to_berat' => 50, 'nominal' => 19000, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 50, 'to_berat' => 250, 'nominal' => 16900, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'berat', 'from_berat' => 250, 'nominal' => 10500, 'satuan_barang_id' => 2]);
        $kapal->items()->create(['tipe' => 'volume', 'volume' => 1, 'nominal' => 4000, 'satuan_barang_id' => 1]);
    }
}
