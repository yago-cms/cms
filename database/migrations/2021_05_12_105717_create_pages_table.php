<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->integer('parent_page_id')->default(0);
            $table->integer('page_template_id')->default(0);
            $table->string('name');
            $table->string('slug')->default('');
            $table->string('route')->default('');
            $table->boolean('is_root')->default(false);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_shown_in_menu')->default(true);
            $table->integer('sorting')->default(0);
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
        Schema::dropIfExists('pages');
    }
}
