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
        Schema::create('opsi_pengiriman_items', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('opsi_pengiriman_id')->constrained('opsi_pengirimen')->onDelete('cascade');
            $table->double('from_berat')->nullable()->comment('/kg');
            $table->double('to_berat')->nullable()->comment('/kg');
            $table->double('volume')->nullable()->comment('/cm3');
            $table->double('nominal');
            $table->timestamps();
        });

        Schema::table('opsi_pengirimen', function (Blueprint $table) {
            $table->dropColumn('berat');
            $table->dropColumn('volume');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('opsi_pengiriman_items');
    }
};
