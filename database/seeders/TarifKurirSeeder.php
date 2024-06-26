<?php

namespace Database\Seeders;

use App\Models\TarifKurir;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TarifKurirSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('tarif_kurirs')->delete();

        $tarif = TarifKurir::create([
            'to_province_code' => 91,
            'to_city_code' => 9103,
            'to_district_code' => 910301,
            'keterangan' => 'Sentani dan sekitarnya'
        ]);
        $tarif->items()->create(['from_berat' => 0, 'to_berat' => 15, 'nominal' => 20000]);
        $tarif->items()->create(['from_berat' => 15, 'to_berat' => 30, 'nominal' => 40000]);
        $tarif->items()->create(['from_berat' => 30, 'to_berat' => 50, 'nominal' => 80000]);
        $tarif->items()->create(['from_berat' => 50, 'nominal' => 120000]);
    }
}
