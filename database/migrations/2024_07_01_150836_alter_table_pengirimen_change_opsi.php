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
        Schema::table('pengirimen', function (Blueprint $table) {
            $table->dropForeign(['opsi_pengiriman_item_id']);
            $table->dropColumn('opsi_pengiriman_item_id');
        });

        // Schema::table('pengiriman_items', function (Blueprint $table) {
        //     $table->double('')
        // });

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
