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
        Schema::table('travelogues', function (Blueprint $table) {
            if (!Schema::hasColumn('travelogues', 'abuse_reported')) {
                $table->integer('abuse_reported')->default(0)->after('published_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('travelogues', function (Blueprint $table) {
            if (Schema::hasColumn('travelogues', 'abuse_reported')) {
                $table->dropColumn('abuse_reported');
            }
        });
    }
};
