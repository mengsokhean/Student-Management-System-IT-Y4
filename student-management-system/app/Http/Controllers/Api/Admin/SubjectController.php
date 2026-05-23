<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GradeSubject;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json(Subject::orderBy('name_en')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_kh' => 'required|string',
            'name_en' => 'required|string',
            'code'    => 'required|string|unique:subjects,code',
        ]);

        $subject = Subject::create($data);

        return response()->json($subject, 201);
    }

    public function show(Subject $subject)
    {
        return response()->json($subject->load('grades'));
    }

    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'name_kh' => 'sometimes|string',
            'name_en' => 'sometimes|string',
            'code'    => 'sometimes|string|unique:subjects,code,' . $subject->id,
        ]);

        $subject->update($data);

        return response()->json($subject);
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }

    // ចាត់តាំង Subject ទៅ Grade + Track
    public function assignToGrade(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'track'    => 'nullable|in:science,social_science',
        ]);

        GradeSubject::firstOrCreate([
            'grade_id'   => $data['grade_id'],
            'subject_id' => $subject->id,
            'track'      => $data['track'] ?? null,
        ]);

        return response()->json(['message' => 'Assigned successfully.']);
    }

    public function removeFromGrade(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'track'    => 'nullable|in:science,social_science',
        ]);

        GradeSubject::where([
            'grade_id'   => $data['grade_id'],
            'subject_id' => $subject->id,
            'track'      => $data['track'] ?? null,
        ])->delete();

        return response()->json(['message' => 'Removed successfully.']);
    }
}