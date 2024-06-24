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
        Schema::create('komplains', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('pengiriman_id')->constrained('pengirimen')->onDelete('cascade');
            $table->longText('catatan');
            $table->string('attachment');
            $table->string('jenis')->nullable();
            $table->string('status')->default('On Progress');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('komplains');
    }
};
