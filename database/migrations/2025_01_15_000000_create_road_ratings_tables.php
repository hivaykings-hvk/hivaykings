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
        Schema::create('road_ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('from_city');
            $table->string('to_city');
            $table->string('highway_number');
            $table->text('description');
            $table->integer('distance_km');
            $table->integer('travel_time_hours');
            $table->longText('image');
            $table->enum('region', ['north', 'south', 'east', 'west', 'central']);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('chief_road_ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('road_rating_id');
            $table->float('road_condition');
            $table->float('traffic');
            $table->float('facilities');
            $table->float('safety_index');
            $table->float('scenic_value');
            $table->timestamps();
            $table->foreign('road_rating_id')->references('id')->on('road_ratings')->onDelete('cascade');
        });

        Schema::create('user_road_ratings', function (Blueprint $table) {
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
        });

        Schema::create('road_rating_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('road_rating_id');
            $table->uuid('user_id');
            $table->text('content');
            $table->timestamps();
            $table->foreign('road_rating_id')->references('id')->on('road_ratings')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('road_rating_comments');
        Schema::dropIfExists('user_road_ratings');
        Schema::dropIfExists('chief_road_ratings');
        Schema::dropIfExists('road_ratings');
    }
};
