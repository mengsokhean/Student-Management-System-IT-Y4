<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Grade;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        $query = Classroom::with(['academicYear', 'grade', 'homeroomTeacher.teacherProfile']);

        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'grade_id'         => 'required|exists:grades,id',
            'name'             => 'required|string',
            'track'            => 'nullable|in:science,social_science',
            'max_students'     => 'integer|min:1|max:60',
        ]);

        // Grade 10 មិនមាន track
        $grade = Grade::find($data['grade_id']);
        if ($grade->level === '10') {
            $data['track'] = null;
        }

        $classroom = Classroom::create($data);

        return response()->json($classroom->load(['academicYear', 'grade']), 201);
    }

    public function show(Classroom $classroom)
    {
        return response()->json(
            $classroom->load([
                'academicYear',
                'grade',
                'homeroomTeacher.teacherProfile',
                'teacherClassSubjects.teacherProfile',
                'teacherClassSubjects.subject',
                'students',
            ])
        );
    }

    public function update(Request $request, Classroom $classroom)
    {
        $data = $request->validate([
            'name'         => 'sometimes|string',
            'track'        => 'nullable|in:science,social_science',
            'max_students' => 'sometimes|integer|min:1|max:60',
        ]);

        $classroom->update($data);

        return response()->json($classroom);
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
}