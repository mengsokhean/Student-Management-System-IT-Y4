<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PublicResultController extends Controller
{
    /**
     * Verify student identity by name + date of birth, then issue a short-lived result token.
     * POST /api/public/verify-student
     * Body: { studentName: string, dob: "YYYY-MM-DD" }
     */
    public function verify(Request $request)
    {
        $request->validate([
            'studentName' => 'required|string|min:2|max:100',
            'dob'         => 'required|date_format:Y-m-d',
        ]);

        $name = trim($request->studentName);
        $dob  = $request->dob;

        // Search by name (Khmer OR Latin) AND exact date of birth
        $student = Student::where(function ($q) use ($name) {
                $q->where('name_kh', 'like', '%' . $name . '%')
                  ->orWhere('name_en', 'like', '%' . $name . '%');
            })
            ->whereDate('date_of_birth', $dob)
            ->first();

        if (!$student) {
            // Log failed attempt for monitoring (no sensitive info logged)
            \Log::info('Public result search: no match', [
                'ip'  => $request->ip(),
                'dob' => $dob,
            ]);

            return response()->json([
                'message' => 'រកមិនឃើញទិន្នន័យ។ សូមពិនិត្យឈ្មោះ និងថ្ងៃខែឆ្នាំកំណើតម្ដងទៀត',
            ], 404);
        }

        // Issue short-lived token (expires in 30 minutes)
        $token    = Str::random(64);
        $cacheKey = "result_token:{$token}";

        Cache::put($cacheKey, [
            'student_id'   => $student->id,
            'student_code' => $student->student_code,
            'ip'           => $request->ip(),
            'created_at'   => now()->toISOString(),
        ], now()->addMinutes(30));

        return response()->json([
            'token'      => $token,
            'student_id' => $student->id,
            'expires_in' => 1800, // 30 minutes
        ]);
    }


    /**
     * Return student result after token validation.
     * GET /api/public/student-result/{studentId}
     * Header: X-Result-Token: <token>
     */
    public function show(Request $request, $studentId)
    {
        $token    = $request->header('X-Result-Token');
        $cacheKey = "result_token:{$token}";

        if (!$token) {
            return response()->json(['message' => 'Token required'], 401);
        }

        $tokenData = Cache::get($cacheKey);

        if (!$tokenData) {
            return response()->json(['message' => 'Token invalid or expired'], 401);
        }

        // Token must match the requested student
        if ((string)$tokenData['student_id'] !== (string)$studentId) {
            return response()->json(['message' => 'Token mismatch'], 403);
        }

        $student = Student::with([
            'studentClassrooms.classroom.grade',
            'studentClassrooms.classroom.academicYear',
            'scores.subject',
            'attendances',
        ])->find($studentId);

        if (!$student) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // Get latest classroom enrollment
        $enrollment = $student->studentClassrooms()
            ->with(['classroom.grade', 'classroom.academicYear'])
            ->latest()
            ->first();

        $classroom = $enrollment?->classroom;

        // Get scores grouped
        $scores = $student->scores()
            ->with('subject')
            ->get()
            ->map(function ($score) {
                return [
                    'subject' => $score->subject->name_kh ?? '—',
                    'm1'      => $score->month1  ?? 0,
                    'm2'      => $score->month2  ?? 0,
                    'm3'      => $score->month3  ?? 0,
                    'm4'      => $score->month4  ?? 0,
                    'exam'    => $score->exam_score ?? 0,
                ];
            });

        // Attendance stats
        $attendances  = $student->attendances;
        $attPresent   = $attendances->where('status', 'present')->count();
        $attAbsent    = $attendances->where('status', 'absent')->count();
        $attLate      = $attendances->where('status', 'late')->count();
        $attLeave     = $attendances->where('status', 'leave')->count();
        $attTotal     = $attendances->count();

        // Class ranking (simplified — rank by average score)
        $classRank      = 1; // TODO: compute real rank from DB
        $totalStudents  = $classroom
            ? $classroom->students()->count()
            : 0;

        return response()->json([
            'student' => [
                'student_code'  => $student->student_code,
                'name_kh'       => $student->name_kh,
                'name_en'       => $student->name_en,
                'gender'        => $student->gender,
                'date_of_birth' => $student->date_of_birth,
            ],
            'classroom' => [
                'name'          => $classroom?->name,
                'grade'         => $classroom?->grade?->name,
                'track'         => $classroom?->track ?? '',
                'academic_year' => $classroom?->academicYear?->name,
                'semester'      => '1',
            ],
            'scores'    => $scores,
            'attendance' => [
                'present' => $attPresent,
                'absent'  => $attAbsent,
                'late'    => $attLate,
                'leave'   => $attLeave,
                'total'   => $attTotal,
            ],
            'class_rank'       => $classRank,
            'total_students'   => $totalStudents,
            'teacher_comment'  => $enrollment?->teacher_comment  ?? null,
            'behavior_comment' => $enrollment?->behavior_comment ?? null,
        ]);
    }

}