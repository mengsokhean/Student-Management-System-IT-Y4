<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    // GET /admin/students  (or via enrollment index)
    public function index(Request $request)
    {
        $search = trim($request->input('search', ''));
        $classroomId = $request->input('classroom_id', '');

        $totalStudents    = Student::count();
        $maleStudents     = Student::where('gender', 'male')->count();
        $femaleStudents   = Student::where('gender', 'female')->count();
        $enrolledStudents = Student::whereHas('classrooms', fn($q) => $q->where('student_classroom.status', 'active'))->count();

        $students = Student::with([
            'user',
            'classrooms' => fn ($q) => $q->wherePivot('status', 'active')->with(['grade', 'homeroomTeacher.teacherProfile']),
        ])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->whereLike('student_code', "%{$search}%")
                          ->orWhereLike('name_kh', "%{$search}%")
                          ->orWhereLike('name_en', "%{$search}%")
                          ->orWhereLike('guardian_phone', "%{$search}%");
                });
            })
            ->when($classroomId, function($q) use ($classroomId) {
                $q->whereHas('classrooms', fn($c) => $c->where('classrooms.id', $classroomId)->where('student_classroom.status', 'active'));
            })
            ->orderBy('name_en')
            ->paginate(15)
            ->withQueryString();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($students);
        }

        $classroomsList = Classroom::orderBy('name')->get();

        return view('admin.students.index', compact(
            'students', 'search', 'classroomId', 'classroomsList',
            'totalStudents', 'maleStudents', 'femaleStudents', 'enrolledStudents'
        ));
    }

    // GET /admin/students/create
    public function create()
    {
        $classrooms    = Classroom::with(['grade', 'academicYear'])->orderBy('name')->get();
        $academicYears = AcademicYear::orderByDesc('id')->get();

        return view('admin.students.create', compact('classrooms', 'academicYears'));
    }

    // POST /admin/students
    // Creates the Student record (+ optional User account) and enrolls into a classroom
    public function store(Request $request)
    {
        $request->validate([
            'classroom_id'   => 'required|exists:classrooms,id',
            'student_code'   => 'required|string|unique:students,student_code',
            'name_kh'        => 'required|string',
            'name_en'        => 'required|string',
            'date_of_birth'  => 'required|date',
            'gender'         => 'required|in:male,female',
            'guardian_name'  => 'required|string',
            'guardian_phone' => 'required|string',
            'phone'          => 'nullable|string',
            'address'        => 'nullable|string',
            // Login account fields (optional — student may not need portal access)
            'email'    => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        DB::beginTransaction();
        try {
            $userId = null;

            // Only create a login account if email was provided
            if ($request->filled('email')) {
                $user = User::create([
                    'name'      => $request->name_en,
                    'email'     => $request->email,
                    'password'  => Hash::make($request->password ?? 'password'),
                    'role'      => 'student',
                    'is_active' => true,
                ]);
                $userId = $user->id;
            }

            $student = Student::create([
                'user_id'        => $userId,
                'student_code'   => $request->student_code,
                'name_kh'        => $request->name_kh,
                'name_en'        => $request->name_en,
                'date_of_birth'  => $request->date_of_birth,
                'gender'         => $request->gender,
                'phone'          => $request->phone,
                'guardian_name'  => $request->guardian_name,
                'guardian_phone' => $request->guardian_phone,
                'address'        => $request->address,
            ]);

            // Check classroom capacity before enrolling
            $classroom = Classroom::findOrFail($request->classroom_id);
            $activeCount = $classroom->students()->wherePivot('status', 'active')->count();

            if ($activeCount >= $classroom->max_students) {
                DB::rollBack();
                return back()
                    ->withInput()
                    ->withErrors(['classroom_id' => 'ថ្នាក់រៀននេះពេញហើយ។ មិនអាចចុះឈ្មោះបានទេ។']);
            }

            $student->classrooms()->attach($request->classroom_id, [
                'status'      => 'active',
                'enrolled_at' => now()->toDateString(),
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withInput()
                ->withErrors(['error' => 'មានបញ្ហាក្នុងការចុះឈ្មោះ៖ ' . $e->getMessage()]);
        }

        \App\Models\ActivityLog::log('created', 'Student', "Registered new student: {$request->name_en}");

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'សិស្សត្រូវបានចុះឈ្មោះដោយជោគជ័យ។');
    }

    // GET /admin/students/{student}
    public function show(Student $student)
    {
        $student->load([
            'user',
            'classrooms.grade',
            'classrooms.academicYear',
            'classrooms.homeroomTeacher.teacherProfile',
            'attendances',
            'scores',
        ]);

        return view('admin.students.show', compact('student'));
    }

    // GET /admin/students/{student}/edit
    public function edit(Student $student)
    {
        $student->load('user');

        return view('admin.students.edit', compact('student'));
    }

    // PUT /admin/students/{student}
    public function update(Request $request, Student $student)
    {
        $request->validate([
            'name_kh'        => 'required|string',
            'name_en'        => 'required|string',
            'date_of_birth'  => 'required|date',
            'gender'         => 'required|in:male,female',
            'guardian_name'  => 'required|string',
            'guardian_phone' => 'required|string',
            'phone'          => 'nullable|string',
            'address'        => 'nullable|string',
            'password'       => 'nullable|string|min:6|confirmed',
        ]);

        $student->update($request->only([
            'name_kh', 'name_en', 'date_of_birth',
            'gender', 'phone', 'guardian_name', 'guardian_phone', 'address',
        ]));

        // Update password only if provided and the student has a user account
        if ($request->filled('password') && $student->user) {
            $student->user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        \App\Models\ActivityLog::log('updated', 'Student', "Updated student: {$student->name_en}");

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'ព័ត៌មានសិស្សត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // DELETE /admin/students/{student}
    public function destroy(Student $student)
    {
        // If the student has a user account, delete it (cascades to student record)
        if ($student->user) {
            $student->user->delete();
        } else {
            $student->delete();
        }

        \App\Models\ActivityLog::log('deleted', 'Student', "Deleted student: {$student->name_en}");

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'សិស្សត្រូវបានលុបដោយជោគជ័យ។');
    }

    // POST /admin/enrollment/enroll  — enroll an existing student into a classroom
    public function enroll(Request $request)
    {
        $data = $request->validate([
            'student_id'   => 'required|exists:students,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $classroom = Classroom::findOrFail($data['classroom_id']);
        $count = $classroom->students()->wherePivot('status', 'active')->count();

        if ($count >= $classroom->max_students) {
            return back()->withErrors(['classroom_id' => 'ថ្នាក់រៀននេះពេញហើយ។']);
        }

        $student = Student::findOrFail($data['student_id']);
        $student->classrooms()->syncWithoutDetaching([
            $data['classroom_id'] => [
                'status'      => 'active',
                'enrolled_at' => now()->toDateString(),
            ],
        ]);

        \App\Models\ActivityLog::log('updated', 'Student', "Enrolled student: {$student->name_en} to classroom");

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'សិស្សត្រូវបានចុះឈ្មោះចូលថ្នាក់ដោយជោគជ័យ។');
    }

    // PATCH /admin/enrollment/{student}/status
    public function updateStatus(Request $request, Student $student)
    {
        $data = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'status'       => 'required|in:active,transferred,dropped,graduated',
        ]);

        $student->classrooms()->updateExistingPivot($data['classroom_id'], [
            'status' => $data['status'],
        ]);

        \App\Models\ActivityLog::log('updated', 'Student', "Updated enrollment status for student: {$student->name_en}");

        return redirect()
            ->route('admin.students.index')
            ->with('success', 'ស្ថានភាពសិស្សត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។');
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /admin/students/export
    // Stream all students as a UTF-8 CSV (BOM-prefixed for Excel)
    // ──────────────────────────────────────────────────────────────────────
    public function export()
    {
        $filename = 'students_' . now()->format('Ymd_His') . '.csv';

        $students = Student::with([
            'classrooms' => fn ($q) => $q->wherePivot('status', 'active')->with('grade'),
        ])
            ->orderBy('name_en')
            ->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($students) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM — required for Excel to render Khmer correctly
            fputs($handle, "\xEF\xBB\xBF");

            // Khmer column headers
            fputcsv($handle, [
                'ល.រ',
                'លេខកូដ',
                'ឈ្មោះ (ខ្មែរ)',
                'ឈ្មោះ (អក្សរលោក)',
                'ភេទ',
                'ថ្ងៃខែឆ្នាំកំណើត',
                'ទូរស័ព្ទ',
                'អ្នកអាណាព្យាបាល',
                'ទូរស័ព្ទអ្នកអាណាព្យាបាល',
                'អាសយដ្ឋាន',
                'ថ្នាក់រៀនបច្ចុប្បន្ន',
                'កម្រិត',
                'ស្ថានភាព',
                'កាលបរិច្ឆេទចុះឈ្មោះ',
            ]);

            foreach ($students as $i => $student) {
                $activeClass = $student->classrooms->first();
                fputcsv($handle, [
                    $i + 1,
                    $student->student_code,
                    $student->name_kh,
                    $student->name_en,
                    $student->gender === 'female' ? 'ស្រី' : 'ប្រុស',
                    $student->date_of_birth ? \Carbon\Carbon::parse($student->date_of_birth)->format('d/m/Y') : '',
                    $student->phone ?? '',
                    $student->guardian_name ?? '',
                    $student->guardian_phone ?? '',
                    $student->address ?? '',
                    $activeClass?->name ?? '',
                    $activeClass?->grade?->name ?? '',
                    $activeClass ? 'កំពុងសិក្សា' : 'មិនទាន់ចុះឈ្មោះ',
                    optional($student->created_at)->format('d/m/Y'),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}

