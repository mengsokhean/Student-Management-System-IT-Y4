<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('classrooms', function (Blueprint $table) {
            $table->string('room')->nullable()
                  ->after('track')
                  ->comment('ទីតាំង / បន្ទប់រៀន ឧ: អគារ A បន្ទប់ 101');
        });
    }

    public function down(): void
    {
        Schema::table('classrooms', function (Blueprint $table) {
            $table->dropColumn('room');
        });
    }
};