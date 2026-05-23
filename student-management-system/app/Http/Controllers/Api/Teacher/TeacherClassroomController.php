<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;

class TeacherClassroomController extends Controller
{
    // បង្ហាញ Classrooms ដែល Teacher បង្រៀន
    public function myClassrooms(Request $request)
    {
        $teacher = TeacherProfile::where('user_id', $request->user()->id)->firstOrFail();

        $classrooms = $teacher->teacherClassSubjects()
            ->with(['classroom.grade', 'classroom.academicYear', 'subject'])
            ->get()
            ->groupBy('classroom_id')
            ->map(function ($items) {
                $classroom = $items->first()->classroom;
                return [
                    'classroom'  => $classroom,
                    'subjects'   => $items->pluck('subject'),
                ];
            })
            ->values();

        // Homeroom classroom
        $homeroom = $teacher->homeroomClassroom?->load('classroom.grade');

        return response()->json([
            'homeroom'   => $homeroom?->classroom ?? null,
            'classrooms' => $classrooms,
        ]);
    }

    // បង្ហាញ Students ក្នុង Classroom
    public function classroomStudents(Request $request, $classroomId)
    {
        $teacher = TeacherProfile::where('user_id', $request->user()->id)->firstOrFail();

        // ពិនិត្យថា Teacher មានសិទ្ធិ classroom នោះ
        $hasAccess = $teacher->teacherClassSubjects()
            ->where('classroom_id', $classroomId)
            ->exists();

        $isHomeroom = $teacher->homeroomClassroom?->classroom_id == $classroomId;

        if (!$hasAccess && !$isHomeroom) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $students = \App\Models\Classroom::findOrFail($classroomId)
            ->students()
            ->wherePivot('status', 'active')
            ->orderBy('name_en')
            ->get();

        return response()->json($students);
    }
}