<?php

namespace App\Http\Controllers\Web\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Score;
use App\Models\Subject;
use App\Models\TeacherClassSubject;
use App\Models\TeacherProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ScoreController extends Controller
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
    // GET /teacher/scores
    // Score entry: pick classroom + subject + semester → student score form
    // ──────────────────────────────────────────────────────────────────────
    public function index(Request $request)
    {
        $profile = $this->teacherProfile();

        // Only classrooms/subjects this teacher actually teaches
        $assignments = $profile->teacherClassSubjects()
            ->with(['classroom.grade', 'classroom.academicYear', 'subject'])
            ->get();

        $classrooms = $assignments->map->classroom->unique('id')->values();

        $students   = collect();
        $scores     = collect();
        $classroom  = null;
        $subject    = null;
        $academicYear = null;
        $semester   = $request->input('semester', 1);

        if ($request->filled('classroom_id') && $request->filled('subject_id')) {
            // Verify the teacher actually teaches this combination
            $valid = $assignments->contains(function ($a) use ($request) {
                return $a->classroom_id == $request->classroom_id
                    && $a->subject_id   == $request->subject_id;
            });
            abort_unless($valid, 403, 'You are not assigned to teach this subject in this classroom.');

            $classroom    = Classroom::with(['grade', 'academicYear'])->findOrFail($request->classroom_id);
            $subject      = Subject::findOrFail($request->subject_id);
            $academicYear = $classroom->academicYear;

            $students = $classroom->students()
                ->wherePivot('status', 'active')
                ->orderBy('name_en')
                ->get();

            // Load existing scores for this classroom/subject/semester/academicYear
            $scores = Score::where([
                'classroom_id'    => $classroom->id,
                'subject_id'      => $subject->id,
                'semester'        => $semester,
                'academic_year_id' => $academicYear->id,
            ])->get()->keyBy('student_id');
        }

        // Build subject list for the selected classroom
        $subjects = collect();
        if ($request->filled('classroom_id')) {
            $subjects = $assignments
                ->where('classroom_id', $request->classroom_id)
                ->map->subject
                ->unique('id')
                ->values();
        }

        return view('teacher.scores.index', compact(
            'classrooms', 'classroom', 'subjects', 'subject',
            'students', 'scores', 'academicYear', 'semester', 'profile'
        ));
    }

    // ──────────────────────────────────────────────────────────────────────
    // POST /teacher/scores/bulk
    // Upsert score records for all students in the form
    // ──────────────────────────────────────────────────────────────────────
    public function bulkStore(Request $request)
    {
        $request->validate([
            'classroom_id'     => 'required|exists:classrooms,id',
            'subject_id'       => 'required|exists:subjects,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester'         => 'required|in:1,2',
            'scores'           => 'required|array',
            'scores.*.month1'     => 'nullable|numeric|min:0|max:100',
            'scores.*.month2'     => 'nullable|numeric|min:0|max:100',
            'scores.*.month3'     => 'nullable|numeric|min:0|max:100',
            'scores.*.month4'     => 'nullable|numeric|min:0|max:100',
            'scores.*.exam_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $profile = $this->teacherProfile();

        // Verify assignment
        $valid = $profile->teacherClassSubjects()
            ->where('classroom_id', $request->classroom_id)
            ->where('subject_id', $request->subject_id)
            ->exists();
        abort_unless($valid, 403);

        DB::transaction(function () use ($request, $profile) {
            foreach ($request->scores as $studentId => $data) {
                Score::updateOrCreate(
                    [
                        'student_id'      => $studentId,
                        'classroom_id'    => $request->classroom_id,
                        'subject_id'      => $request->subject_id,
                        'academic_year_id' => $request->academic_year_id,
                        'semester'        => $request->semester,
                    ],
                    [
                        'month1'     => $data['month1']     ?? null,
                        'month2'     => $data['month2']     ?? null,
                        'month3'     => $data['month3']     ?? null,
                        'month4'     => $data['month4']     ?? null,
                        'exam_score' => $data['exam_score'] ?? null,
                        'entered_by' => $profile->id,
                    ]
                );
            }
        });

        return redirect()
            ->route('teacher.scores.index', [
                'classroom_id' => $request->classroom_id,
                'subject_id'   => $request->subject_id,
                'semester'     => $request->semester,
            ])
            ->with('success', 'ពិន្ទុត្រូវបានរក្សាទុកដោយជោគជ័យ។');
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /teacher/scores/annual-report
    // Per-student annual score report across all subjects & semesters
    // ──────────────────────────────────────────────────────────────────────
    public function studentAnnualReport(Request $request)
    {
        $profile = $this->teacherProfile();

        $assignments = $profile->teacherClassSubjects()
            ->with(['classroom.grade', 'classroom.academicYear', 'subject'])
            ->get();

        $classrooms = $assignments->map->classroom->unique('id')->values();

        $students    = collect();
        $classroom   = null;
        $student     = null;
        $scoreMatrix = collect(); // semester => subject => Score

        if ($request->filled('classroom_id')) {
            $classroom = Classroom::with(['grade', 'academicYear'])->findOrFail($request->classroom_id);

            $students = $classroom->students()
                ->wherePivot('status', 'active')
                ->orderBy('name_en')
                ->get();

            if ($request->filled('student_id')) {
                $student = $students->firstWhere('id', $request->student_id);

                if ($student) {
                    $allScores = Score::with('subject')
                        ->where('classroom_id', $classroom->id)
                        ->where('student_id', $student->id)
                        ->get();

                    // Organise: [semester => [subject_id => Score]]
                    $scoreMatrix = $allScores->groupBy('semester')
                        ->map(fn($rows) => $rows->keyBy('subject_id'));
                }
            }
        }

        return view('teacher.scores.annual-report', compact(
            'classrooms', 'classroom', 'students', 'student', 'scoreMatrix', 'profile'
        ));
    }
}
