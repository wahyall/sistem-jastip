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
        Schema::create('pengiriman_items', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('pengiriman_id')->constrained('pengirimen')->onDelete('cascade');
            $table->foreignId('produk_id')->constrained('produks')->onDelete('cascade');
            $table->foreignId('opsi_pengiriman_id')->constrained('opsi_pengirimen')->onDelete('cascade');
            $table->double('kuantitas')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('pengiriman_items');
    }
};
