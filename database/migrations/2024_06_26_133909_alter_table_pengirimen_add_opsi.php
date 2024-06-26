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
            $table->foreignId('opsi_pengiriman_id')->before('harga_ekspedisi')->constrained('opsi_pengirimen')->onDelete('restrict');
            $table->foreignId('opsi_pengiriman_item_id')->before('harga_ekspedisi')->constrained('opsi_pengiriman_items')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('pengirimen', function (Blueprint $table) {
            //
        });
    }
};
