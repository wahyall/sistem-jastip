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
        Schema::create('produks', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('nama');
            $table->string('gambar');
            $table->longText('deskripsi');
            $table->double('berat');
            $table->foreignId('satuan_berat_id')->constrained('satuan_barangs')->onDelete('restrict');
            $table->double('volume_p');
            $table->double('volume_l');
            $table->double('volume_t');
            $table->foreignId('satuan_volume_id')->constrained('satuan_barangs')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('produks');
    }
};
