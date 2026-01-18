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
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('from_city');
            $table->string('to_city');
            $table->string('highway_number');
            $table->text('description');
            $table->integer('distance_km');
            $table->integer('travel_time_min');
            $table->longText('image');
            $table->enum('region', ['north', 'south', 'east', 'west', 'central']);
            $table->timestamps();
        });

        Schema::create('chief_road_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('road_rating_id')->constrained('road_ratings')->onDelete('cascade');
            $table->float('road_condition');
            $table->float('traffic');
            $table->float('facilities');
            $table->float('safety_index');
            $table->float('scenic_value');
            $table->timestamps();
        });

        Schema::create('user_road_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('road_rating_id')->constrained('road_ratings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->float('road_condition');
            $table->float('traffic');
            $table->float('facilities');
            $table->float('safety_index');
            $table->float('scenic_value');
            $table->timestamps();
        });

        Schema::create('road_rating_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('road_rating_id')->constrained('road_ratings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->timestamps();
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
