<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Score;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    private function getTeacher(Request $request): TeacherProfile
    {
        return TeacherProfile::where('user_id', $request->user()->id)->firstOrFail();
    }

    private function checkSubjectAccess(TeacherProfile $teacher, int $classroomId, int $subjectId): bool
    {
        return $teacher->teacherClassSubjects()
            ->where('classroom_id', $classroomId)
            ->where('subject_id', $subjectId)
            ->exists();
    }

    // បង្ហាញ Scores តាម Classroom + Subject + Semester
    public function index(Request $request)
    {
        $request->validate([
            'classroom_id'     => 'required|exists:classrooms,id',
            'subject_id'       => 'required|exists:subjects,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester'         => 'required|in:1,2',
        ]);

        $teacher = $this->getTeacher($request);

        if (!$this->checkSubjectAccess($teacher, $request->classroom_id, $request->subject_id)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $scores = Score::with('student')
            ->where('classroom_id', $request->classroom_id)
            ->where('subject_id', $request->subject_id)
            ->where('academic_year_id', $request->academic_year_id)
            ->where('semester', $request->semester)
            ->get()
            ->map(function ($score) {
                return [
                    'id'           => $score->id,
                    'student'      => $score->student,
                    'month1'       => $score->month1,
                    'month2'       => $score->month2,
                    'month3'       => $score->month3,
                    'month4'       => $score->month4,
                    'exam_score'   => $score->exam_score,
                    'semester_avg' => $score->semester_avg,
                ];
            });

        return response()->json($scores);
    }

    // បញ្ចូល/កែ Scores ច្រើននាក់តែម្ដង (bulk)
    public function bulkStore(Request $request)
    {
        $request->validate([
            'classroom_id'         => 'required|exists:classrooms,id',
            'subject_id'           => 'required|exists:subjects,id',
            'academic_year_id'     => 'required|exists:academic_years,id',
            'semester'             => 'required|in:1,2',
            'scores'               => 'required|array|min:1',
            'scores.*.student_id'  => 'required|exists:students,id',
            'scores.*.month1'      => 'nullable|numeric|min:0|max:100',
            'scores.*.month2'      => 'nullable|numeric|min:0|max:100',
            'scores.*.month3'      => 'nullable|numeric|min:0|max:100',
            'scores.*.month4'      => 'nullable|numeric|min:0|max:100',
            'scores.*.exam_score'  => 'nullable|numeric|min:0|max:100',
        ]);

        $teacher = $this->getTeacher($request);

        if (!$this->checkSubjectAccess($teacher, $request->classroom_id, $request->subject_id)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $saved = [];
        foreach ($request->scores as $item) {
            $saved[] = Score::updateOrCreate(
                [
                    'student_id'       => $item['student_id'],
                    'classroom_id'     => $request->classroom_id,
                    'subject_id'       => $request->subject_id,
                    'academic_year_id' => $request->academic_year_id,
                    'semester'         => $request->semester,
                ],
                [
                    'month1'      => $item['month1'] ?? null,
                    'month2'      => $item['month2'] ?? null,
                    'month3'      => $item['month3'] ?? null,
                    'month4'      => $item['month4'] ?? null,
                    'exam_score'  => $item['exam_score'] ?? null,
                    'entered_by'  => $teacher->id,
                ]
            );
        }

        return response()->json([
            'message' => 'Scores saved.',
            'count'   => count($saved),
        ]);
    }

    // Annual Average សម្រាប់ Student តែម្នាក់
    public function studentAnnualReport(Request $request)
    {
        $request->validate([
            'student_id'       => 'required|exists:students,id',
            'classroom_id'     => 'required|exists:classrooms,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);

        $scores = Score::with('subject')
            ->where('student_id', $request->student_id)
            ->where('classroom_id', $request->classroom_id)
            ->where('academic_year_id', $request->academic_year_id)
            ->get()
            ->groupBy('subject_id')
            ->map(function ($items) {
                $sem1 = $items->firstWhere('semester', '1');
                $sem2 = $items->firstWhere('semester', '2');

                $avg1 = $sem1?->semester_avg;
                $avg2 = $sem2?->semester_avg;

                $annual = ($avg1 !== null && $avg2 !== null)
                    ? round(($avg1 + $avg2) / 2, 2)
                    : null;

                return [
                    'subject'       => $items->first()->subject,
                    'semester1_avg' => $avg1,
                    'semester2_avg' => $avg2,
                    'annual_avg'    => $annual,
                ];
            })
            ->values();

        return response()->json($scores);
    }
}