<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\ClassroomHomeroomTeacher;
use App\Models\Grade;
use App\Models\TeacherProfile;
use App\Models\TeacherClassSubject;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    // GET /admin/classrooms
    public function index(Request $request)
    {
        $search = trim($request->input('search', ''));

        $classrooms = Classroom::with([
            'grade',
            'academicYear',
            'homeroomTeacher.teacherProfile',
        ])
        ->withCount('students')
        ->when($search, function ($q) use ($search) {
            $q->where(function ($inner) use ($search) {
                $inner->whereLike('classrooms.name', "%{$search}%")
                      ->orWhereHas('grade',        fn ($g) => $g->whereLike('name', "%{$search}%"))
                      ->orWhereHas('academicYear', fn ($a) => $a->whereLike('name', "%{$search}%"));
            });
        })
        ->orderBy('academic_year_id', 'desc')
        ->orderBy('grade_id')
        ->orderBy('name')
        ->paginate(20)
        ->withQueryString();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($classrooms);
        }

        return view('admin.classrooms.index', compact('classrooms', 'search'));
    }

    // GET /admin/classrooms/create
    public function create()
    {
        $grades        = Grade::orderBy('level')->get();
        $academicYears = AcademicYear::orderByDesc('id')->get();
        $teachers      = TeacherProfile::with('user')->orderBy('name_en')->get();

        return view('admin.classrooms.create', compact('grades', 'academicYears', 'teachers'));
    }

    // POST /admin/classrooms
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:30',
            'grade_id'         => 'required|exists:grades,id',
            'track'            => 'nullable|in:science,social_science',
            'academic_year_id' => 'required|exists:academic_years,id',
            'room'             => 'nullable|string|max:50',
            'max_students'     => 'nullable|integer|min:1|max:60',
            'teacher_profile_id' => 'nullable|exists:teacher_profiles,id',
        ]);

        $classroom = Classroom::create([
            'name'             => $data['name'],
            'grade_id'         => $data['grade_id'],
            'track'            => $data['track'] ?? null,
            'academic_year_id' => $data['academic_year_id'],
            'room'             => $data['room'] ?? null,
            'max_students'     => $data['max_students'] ?? 40,
        ]);

        // Assign homeroom teacher if provided
        if (!empty($data['teacher_profile_id'])) {
            ClassroomHomeroomTeacher::updateOrCreate(
                ['classroom_id'       => $classroom->id],
                ['teacher_profile_id' => $data['teacher_profile_id']]
            );
        }

        \App\Models\ActivityLog::log('created', 'Classroom', "Created classroom: {$classroom->name}");

        return redirect()
            ->route('admin.classrooms.index')
            ->with('success', 'ថ្នាក់រៀនត្រូវបានបន្ថែមដោយជោគជ័យ។');
    }

    // GET /admin/classrooms/{classroom}
    public function show(Classroom $classroom)
    {
        $classroom->load([
            'grade',
            'academicYear',
            'homeroomTeacher.teacherProfile.user',
            'students',
            'teacherClassSubjects.subject',
            'teacherClassSubjects.teacherProfile',
        ]);

        return view('admin.classrooms.show', compact('classroom'));
    }

    // GET /admin/classrooms/{classroom}/edit
    public function edit(Classroom $classroom)
    {
        $classroom->load('homeroomTeacher');

        $grades        = Grade::orderBy('level')->get();
        $academicYears = AcademicYear::orderByDesc('id')->get();
        $teachers      = TeacherProfile::with('user')->orderBy('name_en')->get();

        return view('admin.classrooms.edit', compact('classroom', 'grades', 'academicYears', 'teachers'));
    }

    // PUT /admin/classrooms/{classroom}
    public function update(Request $request, Classroom $classroom)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:30',
            'grade_id'         => 'required|exists:grades,id',
            'track'            => 'nullable|in:science,social_science',
            'academic_year_id' => 'required|exists:academic_years,id',
            'room'             => 'nullable|string|max:50',
            'max_students'     => 'nullable|integer|min:1|max:60',
            'teacher_profile_id' => 'nullable|exists:teacher_profiles,id',
        ]);

        $classroom->update([
            'name'             => $data['name'],
            'grade_id'         => $data['grade_id'],
            'track'            => $data['track'] ?? null,
            'academic_year_id' => $data['academic_year_id'],
            'room'             => $data['room'] ?? null,
            'max_students'     => $data['max_students'] ?? $classroom->max_students,
        ]);

        // Update homeroom teacher
        if (!empty($data['teacher_profile_id'])) {
            ClassroomHomeroomTeacher::updateOrCreate(
                ['classroom_id'       => $classroom->id],
                ['teacher_profile_id' => $data['teacher_profile_id']]
            );
        } else {
            // Remove homeroom teacher if cleared
            ClassroomHomeroomTeacher::where('classroom_id', $classroom->id)->delete();
        }

        \App\Models\ActivityLog::log('updated', 'Classroom', "Updated classroom: {$classroom->name}");

        return redirect()
            ->route('admin.classrooms.index')
            ->with('success', 'ថ្នាក់រៀនត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // DELETE /admin/classrooms/{classroom}
    public function destroy(Classroom $classroom)
    {
        $classroom->delete();

        \App\Models\ActivityLog::log('deleted', 'Classroom', "Deleted classroom: {$classroom->name}");

        return redirect()
            ->route('admin.classrooms.index')
            ->with('success', 'ថ្នាក់រៀនត្រូវបានលុបដោយជោគជ័យ។');
    }

    // GET /admin/classrooms/{classroom}/assign-subjects
    public function assignSubjects(Classroom $classroom)
    {
        $classroom->load(['grade', 'academicYear']);

        // Get subjects for this grade and track
        $subjects = $classroom->grade->subjects()->where(function ($q) use ($classroom) {
            $q->whereNull('grade_subject.track')
              ->orWhere('grade_subject.track', $classroom->track);
        })->orderBy('name_en')->get();

        $teachers = TeacherProfile::with('user')->orderBy('name_en')->get();

        // Get current assignments
        $assignments = TeacherClassSubject::where('classroom_id', $classroom->id)
            ->pluck('teacher_profile_id', 'subject_id')
            ->toArray();

        return view('admin.classrooms.assign-subjects', compact('classroom', 'subjects', 'teachers', 'assignments'));
    }

    // POST /admin/classrooms/{classroom}/assign-subjects
    public function storeSubjectAssignments(Request $request, Classroom $classroom)
    {
        $data = $request->validate([
            'assignments'   => 'array',
            'assignments.*' => 'nullable|exists:teacher_profiles,id',
        ]);

        $assignments = $data['assignments'] ?? [];

        // Delete all current assignments for this classroom
        TeacherClassSubject::where('classroom_id', $classroom->id)->delete();

        // Insert new assignments
        $insertData = [];
        foreach ($assignments as $subjectId => $teacherId) {
            if (!empty($teacherId)) {
                $insertData[] = [
                    'classroom_id'       => $classroom->id,
                    'subject_id'         => $subjectId,
                    'teacher_profile_id' => $teacherId,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ];
            }
        }

        if (!empty($insertData)) {
            TeacherClassSubject::insert($insertData);
        }

        \App\Models\ActivityLog::log('updated', 'Classroom', "Assigned subjects to classroom: {$classroom->name}");

        return redirect()
            ->route('admin.classrooms.show', $classroom)
            ->with('success', 'ការចាត់តាំងគ្រូមុខវិជ្ជាត្រូវបានរក្សាទុកដោយជោគជ័យ។');
    }
}
