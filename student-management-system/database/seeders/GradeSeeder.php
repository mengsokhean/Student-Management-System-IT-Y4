<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        $grades = [
            ['level' => '10', 'name' => 'ថ្នាក់ទី១០'],
            ['level' => '11', 'name' => 'ថ្នាក់ទី១១'],
            ['level' => '12', 'name' => 'ថ្នាក់ទី១២'],
        ];

        foreach ($grades as $grade) {
            Grade::firstOrCreate(['level' => $grade['level']], $grade);
        }
    }
}