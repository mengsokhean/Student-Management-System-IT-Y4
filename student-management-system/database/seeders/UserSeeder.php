<?php

namespace Database\Seeders;

use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::firstOrCreate(
            ['email' => 'admin@school.edu.kh'],
            [
                'name'      => 'Admin',
                'password'  => Hash::make('password'),
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        // Teacher
        $teacher = User::firstOrCreate(
            ['email' => 'teacher01@school.edu.kh'],
            [
                'name'      => 'គ្រូ សុភា',
                'password'  => Hash::make('password'),
                'role'      => 'teacher',
                'is_active' => true,
            ]
        );

        TeacherProfile::firstOrCreate(
            ['user_id' => $teacher->id],
            [
                'teacher_code' => 'TCH-001',
                'name_kh'      => 'សុភា',
                'name_en'      => 'Sophea',
                'phone'        => '012345678',
                'gender'       => 'male',
            ]
        );
    }
}