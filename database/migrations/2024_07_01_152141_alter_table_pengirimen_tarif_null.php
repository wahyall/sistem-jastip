<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('pengiriman_items', function (Blueprint $table) {
            $table->dropForeign(['opsi_pengiriman_id']);
            $table->dropColumn('opsi_pengiriman_id');
        });
        DB::unprepared('ALTER TABLE pengirimen MODIFY tarif_kurir_item_id BIGINT(20) UNSIGNED NULL;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('pengirimen', function (Blueprint $table) {
            //
        });
    }
};
