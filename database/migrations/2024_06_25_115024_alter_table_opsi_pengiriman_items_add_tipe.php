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
        Schema::table('opsi_pengiriman_items', function (Blueprint $table) {
            $table->enum('tipe', ['berat', 'volume']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('opsi_pengiriman_items', function (Blueprint $table) {
            //
        });
    }
};
