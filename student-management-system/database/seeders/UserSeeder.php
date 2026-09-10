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
        // ── Admin (System Admin) ─────────────────────────────────────────────
        // Login: admin@school.edu.kh / password
        User::updateOrCreate(
            ['email' => 'admin@school.edu.kh'],
            [
                'name'      => 'System Admin',
                'password'  => Hash::make('password'),
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        // ── Teacher (Sophea) ─────────────────────────────────────────────────
        // Login: teacher@school.edu.kh / password
        //
        // If the legacy "teacher01@school.edu.kh" record already exists,
        // update it in-place so the TeacherProfile FK (user_id) is preserved
        // and the unique teacher_code constraint is never violated.
        $teacher = User::where('email', 'teacher01@school.edu.kh')
                       ->orWhere('email', 'teacher@school.edu.kh')
                       ->first();

        if ($teacher) {
            $teacher->update([
                'email'     => 'teacher@school.edu.kh',
                'name'      => 'Sophea (Teacher)',
                'password'  => Hash::make('password'),
                'role'      => 'teacher',
                'is_active' => true,
            ]);
        } else {
            $teacher = User::create([
                'email'     => 'teacher@school.edu.kh',
                'name'      => 'Sophea (Teacher)',
                'password'  => Hash::make('password'),
                'role'      => 'teacher',
                'is_active' => true,
            ]);
        }

        TeacherProfile::updateOrCreate(
            ['user_id' => $teacher->id],
            [
                'teacher_code' => '10123456',
                'name_kh'      => 'សុភា',
                'name_en'      => 'Sophea',
                'phone'        => '012345678',
                'gender'       => 'male',
            ]
        );
    }
}