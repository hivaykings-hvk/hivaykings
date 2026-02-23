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
        if (Schema::hasTable('chief_road_ratings') && !Schema::hasColumn('chief_road_ratings', 'user_id')) {
            Schema::table('chief_road_ratings', function (Blueprint $table) {
                $table->uuid('user_id')->nullable()->after('road_rating_id');
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
        if (Schema::hasTable('chief_road_ratings') && Schema::hasColumn('chief_road_ratings', 'user_id')) {
            Schema::table('chief_road_ratings', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
                $table->dropUnique(['road_rating_id', 'user_id']);
                $table->dropColumn('user_id');
            });
        }
    }
};
