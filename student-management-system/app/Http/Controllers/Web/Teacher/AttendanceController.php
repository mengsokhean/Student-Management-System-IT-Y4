<?php

namespace App\Http\Controllers\Web\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
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
    // Helper: get all classroom IDs this teacher is assigned to
    // ──────────────────────────────────────────────────────────────────────
    private function assignedClassroomIds(TeacherProfile $profile): \Illuminate\Support\Collection
    {
        return $profile->teacherClassSubjects()->pluck('classroom_id')
            ->push(optional($profile->homeroomClassroom)->classroom_id)
            ->filter()->unique()->values();
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /teacher/attendance
    // Show filter form + bulk attendance entry table
    // ──────────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $profile     = $this->teacherProfile();
        $assignedIds = $this->assignedClassroomIds($profile);

        $classrooms = Classroom::with(['grade', 'academicYear'])
            ->whereIn('id', $assignedIds)
            ->get();

        $students   = collect();
        $attendance = collect();
        $classroom  = null;
        $date       = $request->input('date', today()->toDateString());

        if ($request->filled('classroom_id')) {
            abort_unless($assignedIds->contains($request->classroom_id), 403);

            $classroom = Classroom::with(['grade', 'academicYear'])->findOrFail($request->classroom_id);

            $students = $classroom->students()
                ->wherePivot('status', 'active')
                ->orderBy('name_en')
                ->get();

            // Load any existing attendance for that day
            $attendance = Attendance::where('classroom_id', $classroom->id)
                ->whereDate('date', $date)
                ->get()
                ->keyBy('student_id');
        }

        return view('teacher.attendance.index', compact(
            'classrooms', 'classroom', 'students', 'attendance', 'date', 'profile'
        ));
    }

    // ──────────────────────────────────────────────────────────────────────
    // POST /teacher/attendance/bulk
    // Save/update attendance records for all students in one submit
    // ──────────────────────────────────────────────────────────────────────
    public function bulkStore(Request $request)
    {
        $request->validate([
            'classroom_id'      => 'required|exists:classrooms,id',
            'date'              => 'required|date',
            'attendance'        => 'required|array',
            'attendance.*.status' => 'required|in:present,absent,late,sick',
        ]);

        $profile     = $this->teacherProfile();
        $assignedIds = $this->assignedClassroomIds($profile);
        abort_unless($assignedIds->contains($request->classroom_id), 403);

        DB::transaction(function () use ($request, $profile) {
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
                        'recorded_by' => $profile->id,
                    ]
                );
            }
        });

        return redirect()
            ->route('teacher.attendance.index', [
                'classroom_id' => $request->classroom_id,
                'date'         => $request->date,
            ])
            ->with('success', 'វត្តមានត្រូវបានរក្សាទុកដោយជោគជ័យ។');
    }

    // ──────────────────────────────────────────────────────────────────────
    // PATCH /teacher/attendance/{attendance}
    // Update a single attendance record
    // ──────────────────────────────────────────────────────────────────────
    public function update(Request $request, Attendance $attendance)
    {
        $request->validate([
            'status' => 'required|in:present,absent,late,sick',
            'note'   => 'nullable|string|max:255',
        ]);

        $profile     = $this->teacherProfile();
        $assignedIds = $this->assignedClassroomIds($profile);
        abort_unless($assignedIds->contains($attendance->classroom_id), 403);

        $attendance->update([
            'status'      => $request->status,
            'note'        => $request->note,
            'recorded_by' => $profile->id,
        ]);

        return back()->with('success', 'វត្តមានត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /teacher/attendance/student-report
    // Per-student attendance summary
    // ──────────────────────────────────────────────────────────────────────
    public function studentReport(Request $request)
    {
        $profile     = $this->teacherProfile();
        $assignedIds = $this->assignedClassroomIds($profile);

        $classrooms = Classroom::with(['grade', 'academicYear'])
            ->whereIn('id', $assignedIds)
            ->get();

        $students  = collect();
        $classroom = null;
        $report    = collect();

        if ($request->filled('classroom_id')) {
            abort_unless($assignedIds->contains($request->classroom_id), 403);

            $classroom = Classroom::with(['grade', 'academicYear'])->findOrFail($request->classroom_id);

            $students = $classroom->students()
                ->wherePivot('status', 'active')
                ->orderBy('name_en')
                ->get();

            // Build summary: count each status per student
            $attendanceData = Attendance::where('classroom_id', $classroom->id)
                ->selectRaw('student_id,
                    COUNT(*) as total,
                    SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                    SUM(CASE WHEN status = "absent"  THEN 1 ELSE 0 END) as absent,
                    SUM(CASE WHEN status = "late"    THEN 1 ELSE 0 END) as late,
                    SUM(CASE WHEN status = "sick"    THEN 1 ELSE 0 END) as sick')
                ->groupBy('student_id')
                ->get()
                ->keyBy('student_id');

            $report = $students->map(function ($student) use ($attendanceData) {
                $row = $attendanceData->get($student->id);
                return [
                    'student' => $student,
                    'total'   => $row->total   ?? 0,
                    'present' => $row->present  ?? 0,
                    'absent'  => $row->absent   ?? 0,
                    'late'    => $row->late     ?? 0,
                    'sick'    => $row->sick     ?? 0,
                ];
            });
        }

        return view('teacher.attendance.student-report', compact(
            'classrooms', 'classroom', 'students', 'report', 'profile'
        ));
    }
}
