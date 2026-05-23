<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year'  => 'required|integer',
        ]);

        $student = Student::where('user_id', $request->user()->id)->firstOrFail();

        // រក classroom active
        $enrollment = $student->classrooms()
            ->wherePivot('status', 'active')
            ->latest('enrolled_at')
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'No active classroom found.'], 404);
        }

        $records = Attendance::where('student_id', $student->id)
            ->where('classroom_id', $enrollment->id)
            ->whereYear('date', $request->year)
            ->whereMonth('date', $request->month)
            ->orderBy('date')
            ->get();

        $summary = [
            'present' => $records->where('status', 'present')->count(),
            'absent'  => $records->where('status', 'absent')->count(),
            'late'    => $records->where('status', 'late')->count(),
            'leave'   => $records->where('status', 'leave')->count(),
            'total'   => $records->count(),
        ];

        return response()->json([
            'classroom' => $enrollment,
            'records'   => $records,
            'summary'   => $summary,
        ]);
    }
}