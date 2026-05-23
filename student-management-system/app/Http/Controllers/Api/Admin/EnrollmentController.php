<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EnrollmentController extends Controller
{
    // បង្ហាញ Students ក្នុង Classroom
    public function classroomStudents(Classroom $classroom)
    {
        $students = $classroom->students()
            ->wherePivot('status', 'active')
            ->orderBy('name_en')
            ->get();

        return response()->json($students);
    }

    // បង្កើត Student ថ្មី + Enroll
    public function store(Request $request)
    {
        $request->validate([
            'classroom_id'   => 'required|exists:classrooms,id',
            'student_code'   => 'required|string|unique:students,student_code',
            'name_kh'        => 'required|string',
            'name_en'        => 'required|string',
            'date_of_birth'  => 'required|date',
            'gender'         => 'required|in:male,female',
            'guardian_name'  => 'required|string',
            'guardian_phone' => 'required|string',
            'phone'          => 'nullable|string',
            'address'        => 'nullable|string',
            'email'          => 'nullable|email|unique:users,email',
            'password'       => 'nullable|string|min:6',
        ]);

        DB::beginTransaction();
        try {
            $userId = null;

            if ($request->filled('email')) {
                $user = User::create([
                    'name'      => $request->name_en,
                    'email'     => $request->email,
                    'password'  => Hash::make($request->password ?? 'password'),
                    'role'      => 'student',
                    'is_active' => true,
                ]);
                $userId = $user->id;
            }

            $student = Student::create([
                'user_id'        => $userId,
                'student_code'   => $request->student_code,
                'name_kh'        => $request->name_kh,
                'name_en'        => $request->name_en,
                'date_of_birth'  => $request->date_of_birth,
                'gender'         => $request->gender,
                'phone'          => $request->phone,
                'guardian_name'  => $request->guardian_name,
                'guardian_phone' => $request->guardian_phone,
                'address'        => $request->address,
            ]);

            $classroom = Classroom::find($request->classroom_id);
            $count = $classroom->students()->wherePivot('status', 'active')->count();

            if ($count >= $classroom->max_students) {
                DB::rollBack();
                return response()->json(['message' => 'Classroom is full.'], 422);
            }

            $student->classrooms()->attach($request->classroom_id, [
                'status'      => 'active',
                'enrolled_at' => now()->toDateString(),
            ]);

            DB::commit();
            return response()->json($student->load('classrooms'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // Enroll Student មានស្រាប់ ចូល Classroom
    public function enroll(Request $request)
    {
        $data = $request->validate([
            'student_id'   => 'required|exists:students,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $classroom = Classroom::find($data['classroom_id']);
        $count = $classroom->students()->wherePivot('status', 'active')->count();

        if ($count >= $classroom->max_students) {
            return response()->json(['message' => 'Classroom is full.'], 422);
        }

        $student = Student::find($data['student_id']);
        $student->classrooms()->syncWithoutDetaching([
            $data['classroom_id'] => [
                'status'      => 'active',
                'enrolled_at' => now()->toDateString(),
            ],
        ]);

        return response()->json(['message' => 'Enrolled successfully.']);
    }

    // ផ្លាស់ប្តូរ Status (transferred, dropped, graduated)
    public function updateStatus(Request $request, Student $student)
    {
        $data = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'status'       => 'required|in:active,transferred,dropped,graduated',
        ]);

        $student->classrooms()->updateExistingPivot($data['classroom_id'], [
            'status' => $data['status'],
        ]);

        return response()->json(['message' => 'Status updated.']);
    }
}