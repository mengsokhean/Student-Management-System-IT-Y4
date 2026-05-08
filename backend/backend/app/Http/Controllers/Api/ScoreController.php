<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function index()
    {
        $scores = Score::with(['student', 'subject'])->get();

        return response()->json([
            'success' => true,
            'message' => 'Score list retrieved successfully',
            'data' => $scores
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'       => 'required|exists:students,id',
            'subject_id'       => 'required|exists:subjects,id',
            'assignment_score' => 'required|numeric|min:0|max:100',
            'midterm_score'    => 'required|numeric|min:0|max:100',
            'final_score'      => 'required|numeric|min:0|max:100',
        ]);

        $average = $this->calculateAverage(
            $validated['assignment_score'],
            $validated['midterm_score'],
            $validated['final_score']
        );

        $grade = $this->calculateGrade($average);

        $score = Score::create([
            'student_id'       => $validated['student_id'],
            'subject_id'       => $validated['subject_id'],
            'assignment_score' => $validated['assignment_score'],
            'midterm_score'    => $validated['midterm_score'],
            'final_score'      => $validated['final_score'],
            'average_score'    => $average,
            'grade'            => $grade,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Score created successfully',
            'data'    => $score
        ], 201);
    }

    public function show($id)
    {
        $score = Score::with(['student', 'subject'])->find($id);

        if (!$score) {
            return response()->json([
                'success' => false,
                'message' => 'Score not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Score retrieved successfully',
            'data'    => $score
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $score = Score::find($id);

        if (!$score) {
            return response()->json([
                'success' => false,
                'message' => 'Score not found'
            ], 404);
        }

        $validated = $request->validate([
            'student_id'       => 'required|exists:students,id',
            'subject_id'       => 'required|exists:subjects,id',
            'assignment_score' => 'required|numeric|min:0|max:100',
            'midterm_score'    => 'required|numeric|min:0|max:100',
            'final_score'      => 'required|numeric|min:0|max:100',
        ]);

        $average = $this->calculateAverage(
            $validated['assignment_score'],
            $validated['midterm_score'],
            $validated['final_score']
        );

        $grade = $this->calculateGrade($average);

        $score->update([
            'student_id'       => $validated['student_id'],
            'subject_id'       => $validated['subject_id'],
            'assignment_score' => $validated['assignment_score'],
            'midterm_score'    => $validated['midterm_score'],
            'final_score'      => $validated['final_score'],
            'average_score'    => $average,
            'grade'            => $grade,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Score updated successfully',
            'data'    => $score
        ], 200);
    }

    public function destroy($id)
    {
        $score = Score::find($id);

        if (!$score) {
            return response()->json([
                'success' => false,
                'message' => 'Score not found'
            ], 404);
        }

        $score->delete();

        return response()->json([
            'success' => true,
            'message' => 'Score deleted successfully'
        ], 200);
    }

    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'student_id'       => 'required|exists:students,id',
            'subject_id'       => 'required|exists:subjects,id',
            'assignment_score' => 'required|numeric|min:0|max:100',
            'midterm_score'    => 'required|numeric|min:0|max:100',
            'final_score'      => 'required|numeric|min:0|max:100',
        ]);

        $average = $this->calculateAverage(
            $validated['assignment_score'],
            $validated['midterm_score'],
            $validated['final_score']
        );

        $grade = $this->calculateGrade($average);

        $score = Score::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'subject_id' => $validated['subject_id'],
            ],
            [
                'assignment_score' => $validated['assignment_score'],
                'midterm_score'    => $validated['midterm_score'],
                'final_score'      => $validated['final_score'],
                'average_score'    => $average,
                'grade'            => $grade,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Score saved successfully',
            'data'    => $score
        ], 200);
    }

    // =========================================================
    // Private Helper Methods
    // =========================================================

    private function calculateAverage($assignment, $midterm, $final)
    {
        return round(($assignment + $midterm + $final) / 3, 2);
    }

    private function calculateGrade($average)
    {
        if ($average >= 90) {
            return 'A';
        } elseif ($average >= 80) {
            return 'B';
        } elseif ($average >= 70) {
            return 'C';
        } elseif ($average >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    }
}