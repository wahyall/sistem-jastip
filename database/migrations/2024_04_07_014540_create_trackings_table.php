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
        Schema::create('trackings', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('pengiriman_id')->constrained('pengirimen')->onDelete('cascade');
            $table->string('status');
            $table->date('tanggal');
            $table->time('jam');
            $table->longText('catatan')->nullable();
            $table->foreignId('kurir_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('trackings');
    }
};
