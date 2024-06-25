<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('pengirimen', function (Blueprint $table) {
            $table->enum('status_bayar', ['Lunas', 'Belum Lunas'])->default('Belum Lunas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('pengirimen', function (Blueprint $table) {
            $table->dropColumn('status_bayar');
        });
    }
};
