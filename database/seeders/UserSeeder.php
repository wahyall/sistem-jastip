<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        DB::table('users')->delete();

        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@ardata.co.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Cabang Jakarta',
            'email' => 'cabang-jakarta@ardata.co.id',
            'password' => bcrypt('password'),
            'role' => 'cabang',
        ]);

        User::create([
            'name' => 'Kurir Satu',
            'email' => 'kurir-satu@ardata.co.id',
            'password' => bcrypt('password'),
            'role' => 'kurir',
        ]);
    }
}
