<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\Subject;
use App\Models\TeacherProfile;
use Illuminate\Support\Facades\Auth;

class AdminDashboardController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────
    // Admin Dashboard
    // GET /admin/dashboard
    // Protected by: middleware('auth:admin') in web.php
    // ──────────────────────────────────────────────────────────────────────
    public function index()
    {
        $admin = Auth::guard('admin')->user();

        $studentCount   = Student::count();
        $teacherCount   = TeacherProfile::count();
        $classroomCount = Classroom::count();
        $subjectCount   = Subject::count();

        $recentClassrooms = Classroom::with(['grade', 'academicYear'])
            ->latest()
            ->take(5)
            ->get();

        return view('admin.dashboard', [
            'admin'            => $admin,
            'studentCount'     => $studentCount,
            'teacherCount'     => $teacherCount,
            'classroomCount'   => $classroomCount,
            'subjectCount'     => $subjectCount,
            'recentClassrooms' => $recentClassrooms,
        ]);
    }
}
