<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('classroom_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->enum('semester', ['1', '2']);
            $table->decimal('month1', 5, 2)->nullable();
            $table->decimal('month2', 5, 2)->nullable();
            $table->decimal('month3', 5, 2)->nullable();
            $table->decimal('month4', 5, 2)->nullable();
            $table->decimal('exam_score', 5, 2)->nullable();
            $table->decimal('semester_avg', 5, 2)->nullable()
                  ->storedAs('ROUND(((month1 + month2 + month3 + month4) + (exam_score * 2)) / 6, 2)');
            $table->foreignId('entered_by')->constrained('teacher_profiles')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(
                ['student_id', 'classroom_id', 'subject_id', 'academic_year_id', 'semester'],
                'unique_score_per_semester'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};