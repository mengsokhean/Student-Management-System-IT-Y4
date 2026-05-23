<?php

namespace App\Http\Controllers\Api\Admin;

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
    public function index()
    {
        return response()->json(
            TeacherProfile::with('user')->orderBy('name_en')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:6',
            'teacher_code' => 'required|string|unique:teacher_profiles,teacher_code',
            'name_kh'      => 'required|string',
            'name_en'      => 'required|string',
            'gender'       => 'required|in:male,female',
            'phone'        => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name'      => $request->name_en,
                'email'     => $request->email,
                'password'  => Hash::make($request->password),
                'role'      => 'teacher',
                'is_active' => true,
            ]);

            $profile = TeacherProfile::create([
                'user_id'      => $user->id,
                'teacher_code' => $request->teacher_code,
                'name_kh'      => $request->name_kh,
                'name_en'      => $request->name_en,
                'gender'       => $request->gender,
                'phone'        => $request->phone,
            ]);

            DB::commit();
            return response()->json($profile->load('user'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show(TeacherProfile $teacherProfile)
    {
        return response()->json(
            $teacherProfile->load([
                'user',
                'homeroomClassroom.classroom.grade',
                'teacherClassSubjects.classroom',
                'teacherClassSubjects.subject',
            ])
        );
    }

    public function update(Request $request, TeacherProfile $teacherProfile)
    {
        $request->validate([
            'name_kh' => 'sometimes|string',
            'name_en' => 'sometimes|string',
            'gender'  => 'sometimes|in:male,female',
            'phone'   => 'nullable|string',
            'password'=> 'sometimes|string|min:6',
        ]);

        $teacherProfile->update($request->only(['name_kh', 'name_en', 'gender', 'phone']));

        if ($request->filled('password')) {
            $teacherProfile->user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return response()->json($teacherProfile->load('user'));
    }

    public function destroy(TeacherProfile $teacherProfile)
    {
        $teacherProfile->user->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }

    // ចាត់តាំង Homeroom Teacher
    public function assignHomeroom(Request $request)
    {
        $data = $request->validate([
            'classroom_id'       => 'required|exists:classrooms,id',
            'teacher_profile_id' => 'required|exists:teacher_profiles,id',
        ]);

        ClassroomHomeroomTeacher::updateOrCreate(
            ['classroom_id' => $data['classroom_id']],
            ['teacher_profile_id' => $data['teacher_profile_id']]
        );

        return response()->json(['message' => 'Homeroom teacher assigned.']);
    }

    // ចាត់តាំង Teacher បង្រៀន Subject ក្នុង Classroom
    public function assignSubject(Request $request)
    {
        $data = $request->validate([
            'teacher_profile_id' => 'required|exists:teacher_profiles,id',
            'classroom_id'       => 'required|exists:classrooms,id',
            'subject_id'         => 'required|exists:subjects,id',
        ]);

        TeacherClassSubject::firstOrCreate($data);

        return response()->json(['message' => 'Subject assigned to teacher.']);
    }

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

        return response()->json(['message' => 'Removed successfully.']);
    }
}