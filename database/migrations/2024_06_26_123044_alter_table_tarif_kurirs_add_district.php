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
        Schema::table('tarif_kurirs', function (Blueprint $table) {
            $table->char('to_district_code', 7);
            $table->foreign('to_district_code')->references('code')->on('indonesia_districts')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('tarif_kurirs', function (Blueprint $table) {
            //
        });
    }
};
