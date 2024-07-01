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
        Schema::create('alamats', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('penerima');
            $table->string('telepon');
            $table->string('detail_alamat');
            $table->enum('tandai', ['kantor', 'rumah']);
            $table->string('kode_pos', 10);
            $table->char('province_code', 2);
            $table->foreign('province_code')->references('code')->on('indonesia_provinces')->cascadeOnDelete();

            $table->char('city_code', 4);
            $table->foreign('city_code')->references('code')->on('indonesia_cities')->cascadeOnDelete();

            $table->char('district_code', 8);
            $table->foreign('district_code')->references('code')->on('indonesia_districts')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('alamats');
    }
};
