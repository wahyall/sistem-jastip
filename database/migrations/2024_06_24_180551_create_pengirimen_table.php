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
        Schema::create('pengirimen', function (Blueprint $table) {
            $table->id();
            $table->uuid();

            $table->string('resi');
            $table->foreignId('cabang_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->string('status');

            $table->date('tanggal_kirim');
            $table->date('tanggal_terima')->nullable();

            $table->longText('catatan')->nullable();

            $table->double('harga_ekspedisi');
            $table->foreignId('tarif_kurir_item_id')->constrained('tarif_kurir_items')->onDelete('restrict');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('pengirimen');
    }
};
