<?php

namespace App\Http\Controllers\Web\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Score;
use App\Models\TeacherProfile;
use Illuminate\Support\Facades\Auth;

class TeacherDashboardController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────
    // Teacher Dashboard
    // GET /teacher/dashboard
    // Protected by: middleware('auth:teacher') in web.php
    // ──────────────────────────────────────────────────────────────────────
    public function index()
    {
        $user    = Auth::guard('teacher')->user();
        $teacher = $user;

        $profile = TeacherProfile::where('user_id', $user->id)->first();

        $stats = [
            'classrooms'       => 0,
            'today_attendance' => 0,
            'scores_entered'   => 0,
            'total_students'   => 0,
        ];

        if ($profile) {
            // Count distinct classrooms this teacher is assigned to
            $subjectClassroomIds = $profile->teacherClassSubjects()->pluck('classroom_id')->unique();
            $homeroomClassroomId = optional($profile->homeroomClassroom)->classroom_id;
            $allIds = $subjectClassroomIds->push($homeroomClassroomId)->filter()->unique();

            $stats['classrooms'] = $allIds->count();

            // Today's attendance records entered by this teacher
            $stats['today_attendance'] = Attendance::where('recorded_by', $profile->id)
                ->whereDate('date', today())
                ->count();

            // Total scores entered by this teacher
            $stats['scores_entered'] = Score::where('entered_by', $profile->id)->count();

            // Total unique active students across all assigned classrooms
            $stats['total_students'] = \App\Models\Student::whereHas('classrooms', function ($q) use ($allIds) {
                $q->whereIn('classroom_id', $allIds)
                  ->where('student_classroom.status', 'active');
            })->distinct()->count();
        }

        return view('teacher.dashboard', compact('teacher', 'stats'));
    }
}
