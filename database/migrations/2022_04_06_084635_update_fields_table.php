<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFieldsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fields', function (Blueprint $table) {
            $table->integer('columns')->default(0)->after('key');
        });

        Schema::table('field_blocks', function (Blueprint $table) {
            $table->integer('column')->default(0)->after('field_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fields', function (Blueprint $table) {
            $table->dropColumn(['columns']);
        });

        Schema::table('field_blocks', function (Blueprint $table) {
            $table->dropColumn(['column']);
        });
    }
}
