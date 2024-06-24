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
        Schema::create('tarif_kurir_items', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('tarif_kurir_id')->constrained('tarif_kurirs')->onDelete('cascade');
            $table->double('from_berat')->nullable();
            $table->double('to_berat')->nullable();
            $table->double('nominal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('tarif_kurir_items');
    }
};
