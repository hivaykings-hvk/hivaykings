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
        Schema::table('road_rating_comments', function (Blueprint $table) {
            $table->uuid('parent_id')->nullable()->after('user_id');
            $table->boolean('abuse_reported')->default(false)->after('content');
            $table->foreign('parent_id')->references('id')->on('road_rating_comments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('road_rating_comments', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'abuse_reported']);
        });
    }
};
