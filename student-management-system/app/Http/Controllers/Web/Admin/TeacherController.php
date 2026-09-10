<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassroomHomeroomTeacher;
use App\Models\TeacherClassSubject;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    // GET /admin/teachers
    public function index(Request $request)
    {
        $search = trim($request->input('search', ''));
        $status = $request->input('status', '');

        $totalTeachers  = TeacherProfile::count();
        $maleTeachers   = TeacherProfile::where('gender', 'male')->count();
        $femaleTeachers = TeacherProfile::where('gender', 'female')->count();
        $activeTeachers = TeacherProfile::whereHas('user', fn($q) => $q->where('is_active', true))->count();

        $teachers = TeacherProfile::with('user')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->whereLike('teacher_code', "%{$search}%")
                          ->orWhereLike('name_kh', "%{$search}%")
                          ->orWhereLike('name_en', "%{$search}%")
                          ->orWhereHas('user', fn ($u) => $u->whereLike('email', "%{$search}%"));
                });
            })
            ->when($status, function ($q) use ($status) {
                if ($status === 'active') {
                    $q->whereHas('user', fn($u) => $u->where('is_active', true));
                } elseif ($status === 'inactive') {
                    $q->whereHas('user', fn($u) => $u->where('is_active', false));
                }
            })
            ->orderBy('name_en')
            ->paginate(15)
            ->withQueryString();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($teachers);
        }

        return view('admin.teachers.index', compact(
            'teachers', 'search', 'status',
            'totalTeachers', 'maleTeachers', 'femaleTeachers', 'activeTeachers'
        ));
    }

    // GET /admin/teachers/create
    public function create()
    {
        return view('admin.teachers.create');
    }

    // POST /admin/teachers
    public function store(Request $request)
    {
        $request->validate([
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:6|confirmed',
            'teacher_code' => 'required|numeric|unique:teacher_profiles,teacher_code',
            'name_kh'      => 'required|string',
            'name_en'      => 'required|string',
            'gender'       => 'required|in:male,female',
            'phone'        => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Create the login account with role=teacher
            $user = User::create([
                'name'      => $request->name_en,
                'email'     => $request->email,
                'password'  => Hash::make($request->password),
                'role'      => 'teacher',
                'is_active' => true,
            ]);

            // Create the teacher profile linked to the user
            TeacherProfile::create([
                'user_id'      => $user->id,
                'teacher_code' => $request->teacher_code,
                'name_kh'      => $request->name_kh,
                'name_en'      => $request->name_en,
                'gender'       => $request->gender,
                'phone'        => $request->phone,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withInput()
                ->withErrors(['error' => 'មានបញ្ហាក្នុងការបន្ថែមគ្រូ៖ ' . $e->getMessage()]);
        }

        \App\Models\ActivityLog::log('created', 'TeacherProfile', "Registered new teacher: {$request->name_en}");

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'គ្រូបង្រៀនត្រូវបានបន្ថែមដោយជោគជ័យ។');
    }

    // GET /admin/teachers/{teacher}
    public function show(TeacherProfile $teacher)
    {
        $teacher->load([
            'user',
            'homeroomClassroom.classroom.grade',
            'teacherClassSubjects.classroom',
            'teacherClassSubjects.subject',
        ]);

        return view('admin.teachers.show', compact('teacher'));
    }

    // GET /admin/teachers/{teacher}/edit
    public function edit(TeacherProfile $teacher)
    {
        $teacher->load('user');

        return view('admin.teachers.edit', compact('teacher'));
    }

    // PUT /admin/teachers/{teacher}
    public function update(Request $request, TeacherProfile $teacher)
    {
        $request->validate([
            'name_kh'  => 'required|string',
            'name_en'  => 'required|string',
            'gender'   => 'required|in:male,female',
            'phone'    => 'nullable|string',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $teacher->update($request->only(['name_kh', 'name_en', 'gender', 'phone']));

        // Only update password if a new one was provided
        if ($request->filled('password')) {
            $teacher->user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        \App\Models\ActivityLog::log('updated', 'TeacherProfile', "Updated teacher: {$teacher->name_en}");

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'ព័ត៌មានគ្រូបង្រៀនត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // DELETE /admin/teachers/{teacher}
    public function destroy(TeacherProfile $teacher)
    {
        // Deleting the user will cascade-delete the profile via DB constraint
        $teacher->user->delete();

        \App\Models\ActivityLog::log('deleted', 'TeacherProfile', "Deleted teacher: {$teacher->name_en}");

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'គ្រូបង្រៀនត្រូវបានលុបដោយជោគជ័យ។');
    }

    // POST /admin/teachers/assign-homeroom
    public function assignHomeroom(Request $request)
    {
        $data = $request->validate([
            'classroom_id'       => 'required|exists:classrooms,id',
            'teacher_profile_id' => 'required|exists:teacher_profiles,id',
        ]);

        ClassroomHomeroomTeacher::updateOrCreate(
            ['classroom_id'       => $data['classroom_id']],
            ['teacher_profile_id' => $data['teacher_profile_id']]
        );

        \App\Models\ActivityLog::log('updated', 'TeacherProfile', "Assigned homeroom to teacher ID: {$data['teacher_profile_id']}");

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'គ្រូអាណាព្យាបាលត្រូវបានចាត់តាំងដោយជោគជ័យ។');
    }

    // POST /admin/teachers/assign-subject
    public function assignSubject(Request $request)
    {
        $data = $request->validate([
            'teacher_profile_id' => 'required|exists:teacher_profiles,id',
            'classroom_id'       => 'required|exists:classrooms,id',
            'subject_id'         => 'required|exists:subjects,id',
        ]);

        TeacherClassSubject::firstOrCreate($data);

        \App\Models\ActivityLog::log('updated', 'TeacherProfile', "Assigned subject to teacher ID: {$data['teacher_profile_id']}");

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'មុខវិជ្ជាត្រូវបានចាត់តាំងដល់គ្រូដោយជោគជ័យ។');
    }

    // POST /admin/teachers/remove-subject
    public function removeSubject(Request $request)
    {
        $data = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'required|exists:subjects,id',
        ]);

        TeacherClassSubject::where([
            'classroom_id' => $data['classroom_id'],
            'subject_id'   => $data['subject_id'],
        ])->delete();

        \App\Models\ActivityLog::log('updated', 'TeacherProfile', "Removed subject ID: {$data['subject_id']} from a teacher");

        return redirect()
            ->route('admin.teachers.index')
            ->with('success', 'មុខវិជ្ជាត្រូវបានដកចេញពីគ្រូដោយជោគជ័យ។');
    }

    // ──────────────────────────────────────────────────────────────────────
    // GET /admin/teachers/export
    // Stream all teachers as a UTF-8 CSV (BOM-prefixed for Excel)
    // ──────────────────────────────────────────────────────────────────────
    public function export()
    {
        $filename = 'teachers_' . now()->format('Ymd_His') . '.csv';

        $teachers = TeacherProfile::with('user')
            ->orderBy('name_en')
            ->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($teachers) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM — required for Excel to render Khmer correctly
            fputs($handle, "\xEF\xBB\xBF");

            // Khmer column headers
            fputcsv($handle, [
                'ល.រ',
                'អត្តលេខ',
                'ឈ្មោះ (ខ្មែរ)',
                'ឈ្មោះ (អក្សរលោក)',
                'ភេទ',
                'ទូរស័ព្ទ',
                'អ៊ីម៉ែល',
                'ស្ថានភាព',
                'កាលបរិច្ឆេទចុះឈ្មោះ',
            ]);

            foreach ($teachers as $i => $teacher) {
                fputcsv($handle, [
                    $i + 1,
                    $teacher->teacher_code,
                    $teacher->name_kh,
                    $teacher->name_en,
                    $teacher->gender === 'female' ? 'ស្រី' : 'ប្រុស',
                    $teacher->phone ?? '',
                    $teacher->user?->email ?? '',
                    $teacher->user?->is_active ? 'សកម្ម' : 'អសកម្ម',
                    optional($teacher->created_at)->format('d/m/Y'),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
