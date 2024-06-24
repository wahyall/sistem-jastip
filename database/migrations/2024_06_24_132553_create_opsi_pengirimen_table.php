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
        Schema::create('opsi_pengirimen', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('nama');
            $table->double('berat')->nullable();
            $table->double('volume')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('opsi_pengirimen');
    }
};
