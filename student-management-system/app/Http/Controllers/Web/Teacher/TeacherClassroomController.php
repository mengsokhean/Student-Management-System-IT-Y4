<?php

namespace App\Http\Controllers\Web\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\TeacherProfile;
use Illuminate\Support\Facades\Auth;

class TeacherClassroomController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────
    // Helper: resolve the logged-in teacher's TeacherProfile
    // ──────────────────────────────────────────────────────────────────────
    private function teacherProfile(): TeacherProfile
    {
        $user = Auth::guard('teacher')->user();
        return TeacherProfile::where('user_id', $user->id)->firstOrFail();
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /teacher/my-classrooms
    // List all classrooms the teacher is assigned to (homeroom or subject)
    // ──────────────────────────────────────────────────────────────────────
    public function myClassrooms()
    {
        $profile = $this->teacherProfile();

        // Classrooms where they teach a subject
        $subjectClassroomIds = $profile->teacherClassSubjects()->pluck('classroom_id');

        // Classroom where they are homeroom teacher
        $homeroomClassroomId = optional($profile->homeroomClassroom)->classroom_id;

        // Merge both sets of classroom IDs
        $allIds = $subjectClassroomIds->push($homeroomClassroomId)->filter()->unique();

        $classrooms = Classroom::with(['grade', 'academicYear', 'homeroomTeacher.teacherProfile'])
            ->whereIn('id', $allIds)
            ->get()
            ->map(function ($classroom) use ($profile, $homeroomClassroomId) {
                $classroom->is_homeroom     = ($classroom->id === $homeroomClassroomId);
                $classroom->student_count   = $classroom->students()->wherePivot('status', 'active')->count();
                return $classroom;
            });

        return view('teacher.classrooms.index', compact('classrooms', 'profile'));
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /teacher/classrooms/{classroomId}/students
    // Show all active students in a classroom
    // ──────────────────────────────────────────────────────────────────────
    public function classroomStudents(int $classroomId)
    {
        $profile   = $this->teacherProfile();
        $classroom = Classroom::with(['grade', 'academicYear'])->findOrFail($classroomId);

        // Security: teacher must be assigned to this classroom
        $assignedIds = $profile->teacherClassSubjects()->pluck('classroom_id')
            ->push(optional($profile->homeroomClassroom)->classroom_id)
            ->filter()->unique();

        abort_unless($assignedIds->contains($classroomId), 403, 'You are not assigned to this classroom.');

        $students = $classroom->students()
            ->wherePivot('status', 'active')
            ->orderBy('name_en')
            ->get();

        return view('teacher.classrooms.students', compact('classroom', 'students', 'profile'));
    }
}
