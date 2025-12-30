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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->after('name');
            $table->string('last_name')->after('first_name');
            $table->string('title')->nullable()->after('last_name');
            $table->string('username')->unique()->after('title');
            $table->string('phone')->nullable()->after('email');
            $table->boolean('phone_verified')->default(false)->after('phone');
            $table->string('city')->nullable()->after('phone_verified');
            $table->string('state')->nullable()->after('city');
            $table->string('country')->nullable()->after('state');
            $table->string('pincode')->nullable()->after('country');
            $table->string('image_path')->nullable()->after('pincode');
            $table->boolean('subscribe_newsletter')->default(false)->after('image_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'title',
                'username',
                'phone',
                'phone_verified',
                'city',
                'state',
                'country',
                'pincode',
                'image_path',
                'subscribe_newsletter',
            ]);
        });
    }
};
