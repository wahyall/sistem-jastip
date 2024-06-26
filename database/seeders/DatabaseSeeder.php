<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use KodePandai\Indonesia\IndonesiaDatabaseSeeder;

class DatabaseSeeder extends Seeder {
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run() {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call(UserSeeder::class);
        $this->call(MenuSeeder::class);
        $this->call(IndonesiaDatabaseSeeder::class);
        $this->call(SatuanBarangSeeder::class);
        $this->call(OpsiPengirimanSeeder::class);
        $this->call(TarifKurirSeeder::class);
    }
}
