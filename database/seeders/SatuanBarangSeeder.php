<?php

namespace Database\Seeders;

use App\Models\SatuanBarang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SatuanBarangSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        SatuanBarang::create(['nama' => 'cm3']);
        SatuanBarang::create(['nama' => 'kg']);
        SatuanBarang::create(['nama' => 'gr']);
    }
}
