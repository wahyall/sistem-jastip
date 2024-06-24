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
        Schema::create('tarif_kurirs', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->char('to_province_code', 2);
            $table->foreign('to_province_code')->references('code')->on('indonesia_provinces')->cascadeOnDelete();

            $table->char('to_city_code', 4);
            $table->foreign('to_city_code')->references('code')->on('indonesia_cities')->cascadeOnDelete();

            $table->longText('keterangan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('tarif_kurirs');
    }
};
