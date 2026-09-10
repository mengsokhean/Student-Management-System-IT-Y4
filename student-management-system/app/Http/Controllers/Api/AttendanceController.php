<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    // Note: For this React stub API, we bypass strict auth checks
    // and assume recorded_by = 1 (or the first available teacher).
    private function getTeacherId()
    {
        $teacher = TeacherProfile::first();
        return $teacher ? $teacher->id : 1;
    }

    public function classrooms()
    {
        // For the React admin page, fetch all classrooms
        $classrooms = Classroom::with(['grade', 'academicYear'])->get();
        return response()->json($classrooms);
    }

    public function students(Request $request)
    {
        $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'date'         => 'required|date',
        ]);

        $classroom = Classroom::findOrFail($request->classroom_id);

        $students = $classroom->students()
            ->wherePivot('status', 'active')
            ->orderBy('name_en')
            ->get();

        $attendance = Attendance::where('classroom_id', $classroom->id)
            ->whereDate('date', $request->date)
            ->get()
            ->keyBy('student_id');

        return response()->json([
            'students'   => $students,
            'attendance' => $attendance,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'classroom_id'      => 'required|exists:classrooms,id',
            'date'              => 'required|date',
            'attendance'        => 'required|array',
            'attendance.*.status' => 'required|in:present,absent,late,leave',
        ]);

        $teacherId = $this->getTeacherId();

        DB::transaction(function () use ($request, $teacherId) {
            foreach ($request->attendance as $studentId => $data) {
                Attendance::updateOrCreate(
                    [
                        'student_id'   => $studentId,
                        'classroom_id' => $request->classroom_id,
                        'date'         => $request->date,
                    ],
                    [
                        'status'      => $data['status'],
                        'note'        => $data['note'] ?? null,
                        'recorded_by' => $teacherId,
                    ]
                );
            }
        });

        return response()->json(['message' => 'Attendance saved successfully.']);
    }

    public function report(Request $request)
    {
        $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'month'        => 'required|date_format:Y-m', // e.g. 2026-09
        ]);

        $classroom = Classroom::findOrFail($request->classroom_id);
        
        $students = $classroom->students()
            ->wherePivot('status', 'active')
            ->orderBy('name_en')
            ->get();

        // Count statuses per student for the given month
        $attendanceData = Attendance::where('classroom_id', $classroom->id)
            ->whereRaw("DATE_FORMAT(date, '%Y-%m') = ?", [$request->month])
            ->selectRaw('student_id,
                COUNT(*) as total_recorded,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = "absent"  THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = "late"    THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = "leave"   THEN 1 ELSE 0 END) as leave_count')
            ->groupBy('student_id')
            ->get()
            ->keyBy('student_id');

        $report = $students->map(function ($student) use ($attendanceData) {
            $row = $attendanceData->get($student->id);
            $total = $row->total_recorded ?? 0;
            $present = $row->present ?? 0;
            $late = $row->late ?? 0;
            
            // Percentage: (Present + Late / Total) * 100
            // If we consider Late as partial or full present. Let's say it's fully present for the percentage calculation.
            $percentage = $total > 0 ? round((($present + $late) / $total) * 100, 2) : 100;

            return [
                'student_id'   => $student->id,
                'student_code' => $student->student_code,
                'name_en'      => $student->name_en,
                'name_kh'      => $student->name_kh,
                'total'        => $total,
                'present'      => $present,
                'absent'       => $row->absent ?? 0,
                'late'         => $late,
                'leave'        => $row->leave_count ?? 0,
                'percentage'   => $percentage,
            ];
        });

        return response()->json([
            'classroom' => $classroom,
            'report'    => $report,
        ]);
    }
}
