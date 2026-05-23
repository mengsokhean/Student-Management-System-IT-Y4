<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    private function getHomeroomTeacher(Request $request): TeacherProfile
    {
        return TeacherProfile::where('user_id', $request->user()->id)->firstOrFail();
    }

    private function checkHomeroomAccess(TeacherProfile $teacher, int $classroomId): bool
    {
        return $teacher->homeroomClassroom?->classroom_id == $classroomId;
    }

    // បង្ហាញ Attendance តាម Date
    public function index(Request $request)
    {
        $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'date'         => 'required|date',
        ]);

        $teacher = $this->getHomeroomTeacher($request);

        if (!$this->checkHomeroomAccess($teacher, $request->classroom_id)) {
            return response()->json(['message' => 'Homeroom teacher only.'], 403);
        }

        $attendances = Attendance::with('student')
            ->where('classroom_id', $request->classroom_id)
            ->where('date', $request->date)
            ->get();

        return response()->json($attendances);
    }

    // បញ្ចូល Attendance ច្រើននាក់តែម្ដង (bulk)
    public function bulkStore(Request $request)
    {
        $request->validate([
            'classroom_id'         => 'required|exists:classrooms,id',
            'date'                 => 'required|date',
            'records'              => 'required|array|min:1',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status'     => 'required|in:present,absent,late,leave',
            'records.*.note'       => 'nullable|string',
        ]);

        $teacher = $this->getHomeroomTeacher($request);

        if (!$this->checkHomeroomAccess($teacher, $request->classroom_id)) {
            return response()->json(['message' => 'Homeroom teacher only.'], 403);
        }

        $results = [];
        foreach ($request->records as $record) {
            $results[] = Attendance::updateOrCreate(
                [
                    'student_id'   => $record['student_id'],
                    'classroom_id' => $request->classroom_id,
                    'date'         => $request->date,
                ],
                [
                    'recorded_by' => $teacher->id,
                    'status'      => $record['status'],
                    'note'        => $record['note'] ?? null,
                ]
            );
        }

        return response()->json([
            'message' => 'Attendance saved.',
            'count'   => count($results),
        ]);
    }

    // កែ Attendance មួយ record
    public function update(Request $request, Attendance $attendance)
    {
        $teacher = $this->getHomeroomTeacher($request);

        if (!$this->checkHomeroomAccess($teacher, $attendance->classroom_id)) {
            return response()->json(['message' => 'Homeroom teacher only.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:present,absent,late,leave',
            'note'   => 'nullable|string',
        ]);

        $attendance->update($data);

        return response()->json($attendance);
    }

    // របាយការណ៍ Attendance តាម Student + Month
    public function studentReport(Request $request)
    {
        $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'student_id'   => 'required|exists:students,id',
            'month'        => 'required|integer|min:1|max:12',
            'year'         => 'required|integer',
        ]);

        $teacher = $this->getHomeroomTeacher($request);

        if (!$this->checkHomeroomAccess($teacher, $request->classroom_id)) {
            return response()->json(['message' => 'Homeroom teacher only.'], 403);
        }

        $records = Attendance::where('student_id', $request->student_id)
            ->where('classroom_id', $request->classroom_id)
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
            'records' => $records,
            'summary' => $summary,
        ]);
    }
}