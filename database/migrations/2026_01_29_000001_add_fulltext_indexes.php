<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add full-text index to questions table
        DB::statement('ALTER TABLE questions ADD FULLTEXT INDEX ft_questions (subject, description)');

        // Add full-text index to road_ratings table
        DB::statement('ALTER TABLE road_ratings ADD FULLTEXT INDEX ft_road_ratings (from_city, to_city, highway_number, description)');

        // Add full-text index to question_comments table
        DB::statement('ALTER TABLE question_comments ADD FULLTEXT INDEX ft_comments (content)');
    }

    public function down(): void
    {
        // Drop full-text indexes
        DB::statement('ALTER TABLE questions DROP INDEX ft_questions');
        DB::statement('ALTER TABLE road_ratings DROP INDEX ft_road_ratings');
        DB::statement('ALTER TABLE question_comments DROP INDEX ft_comments');
    }
};
