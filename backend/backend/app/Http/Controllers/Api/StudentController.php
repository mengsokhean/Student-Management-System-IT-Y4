<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with(['classroom', 'subjects'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Student list retrieved successfully',
            'data'    => $students
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email|unique:students,email',
            'password'      => 'required|string|min:6',
            'class_id'      => 'nullable|exists:classes,id',
            'student_code'  => 'required|string|unique:students,student_code',
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'gender'        => 'required|string|max:20',
            'date_of_birth' => 'nullable|date',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string',
            'status'        => 'nullable|string|max:50',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $student = Student::create([
            'user_id'       => $user->id,
            'class_id'      => $validated['class_id'] ?? null,
            'student_code'  => $validated['student_code'],
            'first_name'    => $validated['first_name'],
            'last_name'     => $validated['last_name'],
            'gender'        => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'email'         => $validated['email'],
            'phone'         => $validated['phone'] ?? null,
            'address'       => $validated['address'] ?? null,
            'status'        => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data'    => $student
        ], 201);
    }

    public function show($id)
    {
        $student = Student::with(['classroom', 'subjects', 'scores', 'attendances'])->find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Student retrieved successfully',
            'data'    => $student
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $validated = $request->validate([
            'class_id'      => 'nullable|exists:classes,id',
            'student_code'  => 'required|string|unique:students,student_code,' . $id,
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'gender'        => 'required|string|max:20',
            'date_of_birth' => 'nullable|date',
            'email'         => 'nullable|email',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string',
            'status'        => 'nullable|string|max:50',
        ]);

        $student->update([
            'class_id'      => $validated['class_id'] ?? null,
            'student_code'  => $validated['student_code'],
            'first_name'    => $validated['first_name'],
            'last_name'     => $validated['last_name'],
            'gender'        => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'email'         => $validated['email'] ?? null,
            'phone'         => $validated['phone'] ?? null,
            'address'       => $validated['address'] ?? null,
            'status'        => $validated['status'] ?? 'active',
        ]);

        // អាប់ដេត email នៅក្នុង users table ផងដែរ
        if ($student->user_id && isset($validated['email'])) {
            User::where('id', $student->user_id)->update([
                'email' => $validated['email'],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data'    => $student
        ], 200);
    }

    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully'
        ], 200);
    }
}