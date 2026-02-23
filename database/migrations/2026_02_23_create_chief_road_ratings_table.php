<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('chief_road_ratings')) {
            Schema::create('chief_road_ratings', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('road_rating_id');
                $table->uuid('user_id');
                $table->float('road_condition');
                $table->float('traffic');
                $table->float('facilities');
                $table->float('safety_index');
                $table->float('scenic_value');
                $table->timestamps();

                $table->foreign('road_rating_id')->references('id')->on('road_ratings')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->unique(['road_rating_id', 'user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chief_road_ratings');
    }
};
