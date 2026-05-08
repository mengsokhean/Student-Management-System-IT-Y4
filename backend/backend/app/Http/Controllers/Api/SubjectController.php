<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::with('students')->get();

        return response()->json([
            'success' => true,
            'message' => 'Subject list retrieved successfully',
            'data' => $subjects
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_code' => 'required|string|unique:subjects,subject_code',
            'subject_name' => 'required|string|max:255',
            'credit' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $subject = Subject::create([
            'subject_code' => $validated['subject_code'],
            'subject_name' => $validated['subject_name'],
            'credit' => $validated['credit'] ?? 0,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject created successfully',
            'data' => $subject
        ], 201);
    }

    public function show($id)
    {
        $subject = Subject::with([
            'students.classroom',
            'scores'
        ])->find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $students = $subject->students->map(function ($student) use ($subject) {
            $score = $subject->scores->firstWhere('student_id', $student->id);

            return [
                'id' => $student->id,
                'student_code' => $student->student_code,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'gender' => $student->gender,
                'status' => $student->status,

                'classroom' => $student->classroom ? [
                    'id' => $student->classroom->id,
                    'class_name' => $student->classroom->class_name,
                ] : null,

                'score' => $score ? [
                    'id' => $score->id,
                    'assignment_score' => $score->assignment_score,
                    'midterm_score' => $score->midterm_score,
                    'final_score' => $score->final_score,
                    'average_score' => $score->average_score,
                    'grade' => $score->grade,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Subject detail retrieved successfully',
            'data' => [
                'id' => $subject->id,
                'subject_code' => $subject->subject_code,
                'subject_name' => $subject->subject_name,
                'credit' => $subject->credit,
                'description' => $subject->description,
                'students' => $students,
            ]
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $validated = $request->validate([
            'subject_code' => 'required|string|unique:subjects,subject_code,' . $id,
            'subject_name' => 'required|string|max:255',
            'credit' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $subject->update([
            'subject_code' => $validated['subject_code'],
            'subject_name' => $validated['subject_name'],
            'credit' => $validated['credit'] ?? 0,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject updated successfully',
            'data' => $subject
        ], 200);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json([
                'success' => false,
                'message' => 'Subject not found'
            ], 404);
        }

        $subject->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subject deleted successfully'
        ], 200);
    }
}
