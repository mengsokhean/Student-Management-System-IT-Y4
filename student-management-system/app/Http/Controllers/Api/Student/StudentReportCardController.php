<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Score;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentReportCardController extends Controller
{
    public function show(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester'         => 'nullable|in:1,2',
        ]);

        $student = Student::where('user_id', $request->user()->id)->firstOrFail();

        // រក classroom active នៅ academic year នោះ
        $enrollment = $student->classrooms()
            ->where('academic_year_id', $request->academic_year_id)
            ->wherePivot('status', 'active')
            ->with(['grade', 'academicYear'])
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'No enrollment found for this academic year.'], 404);
        }

        // Scores
        $scoreQuery = Score::with('subject')
            ->where('student_id', $student->id)
            ->where('classroom_id', $enrollment->id)
            ->where('academic_year_id', $request->academic_year_id);

        if ($request->filled('semester')) {
            $scoreQuery->where('semester', $request->semester);
        }

        $scores = $scoreQuery->get()
            ->groupBy('subject_id')
            ->map(function ($items) use ($request) {
                $subject = $items->first()->subject;

                if ($request->filled('semester')) {
                    $sem = $items->first();
                    return [
                        'subject'       => $subject,
                        'semester'      => $sem->semester,
                        'month1'        => $sem->month1,
                        'month2'        => $sem->month2,
                        'month3'        => $sem->month3,
                        'month4'        => $sem->month4,
                        'exam_score'    => $sem->exam_score,
                        'semester_avg'  => $sem->semester_avg,
                        'annual_avg'    => null,
                    ];
                }

                // Annual — គណនា Semester 1 + 2
                $sem1 = $items->firstWhere('semester', '1');
                $sem2 = $items->firstWhere('semester', '2');

                $avg1 = $sem1?->semester_avg;
                $avg2 = $sem2?->semester_avg;

                $annual = ($avg1 !== null && $avg2 !== null)
                    ? round(($avg1 + $avg2) / 2, 2)
                    : null;

                return [
                    'subject'       => $subject,
                    'semester1'     => [
                        'month1'       => $sem1?->month1,
                        'month2'       => $sem1?->month2,
                        'month3'       => $sem1?->month3,
                        'month4'       => $sem1?->month4,
                        'exam_score'   => $sem1?->exam_score,
                        'semester_avg' => $avg1,
                    ],
                    'semester2'     => [
                        'month1'       => $sem2?->month1,
                        'month2'       => $sem2?->month2,
                        'month3'       => $sem2?->month3,
                        'month4'       => $sem2?->month4,
                        'exam_score'   => $sem2?->exam_score,
                        'semester_avg' => $avg2,
                    ],
                    'annual_avg'    => $annual,
                ];
            })
            ->values();

        // Overall GPA
        $annualAvgs = $scores->pluck('annual_avg')->filter();
        $overallAvg = $annualAvgs->count() > 0
            ? round($annualAvgs->avg(), 2)
            : null;

        // Attendance Summary សម្រាប់ Academic Year ទាំងមូល
        $attendanceSummary = Attendance::where('student_id', $student->id)
            ->where('classroom_id', $enrollment->id)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return response()->json([
            'student'     => [
                'id'           => $student->id,
                'student_code' => $student->student_code,
                'name_kh'      => $student->name_kh,
                'name_en'      => $student->name_en,
                'gender'       => $student->gender,
            ],
            'classroom'   => [
                'name'          => $enrollment->name,
                'track'         => $enrollment->track,
                'grade'         => $enrollment->grade->name,
                'academic_year' => $enrollment->academicYear->name,
            ],
            'scores'      => $scores,
            'overall_avg' => $overallAvg,
            'attendance'  => [
                'present' => $attendanceSummary['present'] ?? 0,
                'absent'  => $attendanceSummary['absent']  ?? 0,
                'late'    => $attendanceSummary['late']    ?? 0,
                'leave'   => $attendanceSummary['leave']   ?? 0,
            ],
        ]);
    }
}