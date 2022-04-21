<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePageRevisionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('page_revisions', function (Blueprint $table) {
            $table->id();
            $table->integer('page_id')->default(0);
            $table->integer('page_template_id')->default(0);
            $table->string('name');
            $table->boolean('is_saved')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('page_revisions');
    }
}
