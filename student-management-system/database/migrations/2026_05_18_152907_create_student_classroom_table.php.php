<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('student_classroom', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('classroom_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['active', 'transferred', 'dropped', 'graduated'])->default('active');
            $table->date('enrolled_at');
            $table->timestamps();

            $table->unique(['student_id', 'classroom_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_classroom');
    }
};