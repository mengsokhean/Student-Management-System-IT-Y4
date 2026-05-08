<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        // prevent duplicate
        $exists = Enrollment::where([
            'student_id' => $validated['student_id'],
            'subject_id' => $validated['subject_id'],
        ])->first();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Student already enrolled'
            ], 400);
        }

        $enrollment = Enrollment::create([
            'student_id' => $validated['student_id'],
            'subject_id' => $validated['subject_id'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student enrolled successfully',
            'data' => $enrollment
        ], 201);
    }
}