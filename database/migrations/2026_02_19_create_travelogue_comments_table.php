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
        Schema::create('travelogue_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('travelogue_id');
            $table->uuid('user_id');
            $table->uuid('parent_id')->nullable();
            $table->longText('content');
            $table->boolean('abuse_reported')->default(false);
            $table->timestamps();

            $table->foreign('travelogue_id')->references('id')->on('travelogues')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('travelogue_comments')->onDelete('cascade');

            $table->index('travelogue_id');
            $table->index('user_id');
            $table->index('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travelogue_comments');
    }
};
