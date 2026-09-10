<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    // GET /admin/subjects
    public function index(Request $request)
    {
        $search = trim($request->input('search', ''));

        $subjects = Subject::with('grades')
            ->withCount('grades')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->whereLike('code', "%{$search}%")
                          ->orWhereLike('name_kh', "%{$search}%")
                          ->orWhereLike('name_en', "%{$search}%");
                });
            })
            ->orderBy('name_en')
            ->paginate(15)
            ->withQueryString();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($subjects);
        }

        return view('admin.subjects.index', compact('subjects', 'search'));
    }

    // GET /admin/subjects/create
    public function create()
    {
        $grades = Grade::orderBy('level')->get();

        return view('admin.subjects.create', compact('grades'));
    }

    // POST /admin/subjects
    public function store(Request $request)
    {
        $data = $request->validate([
            'name_kh' => 'required|string',
            'name_en' => 'required|string',
            'code'    => 'required|string|unique:subjects,code',
        ]);

        Subject::create($data);

        \App\Models\ActivityLog::log('created', 'Subject', "Created subject: {$data['name_en']}");

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', 'មុខវិជ្ជាត្រូវបានបន្ថែមដោយជោគជ័យ។');
    }

    // GET /admin/subjects/{subject}/edit
    public function edit(Subject $subject)
    {
        $grades = Grade::orderBy('level')->get();
        $subject->load('grades');

        return view('admin.subjects.edit', compact('subject', 'grades'));
    }

    // PUT /admin/subjects/{subject}
    public function update(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'name_kh' => 'required|string',
            'name_en' => 'required|string',
            'code'    => 'required|string|unique:subjects,code,' . $subject->id,
        ]);

        $subject->update($data);

        \App\Models\ActivityLog::log('updated', 'Subject', "Updated subject: {$subject->name_en}");

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', 'មុខវិជ្ជាត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // DELETE /admin/subjects/{subject}
    public function destroy(Subject $subject)
    {
        $subject->delete();

        \App\Models\ActivityLog::log('deleted', 'Subject', "Deleted subject: {$subject->name_en}");

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', 'មុខវិជ្ជាត្រូវបានលុបដោយជោគជ័យ។');
    }

    // POST /admin/subjects/{subject}/assign-grade
    public function assignToGrade(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'track'    => 'nullable|in:science,social_science',
        ]);

        GradeSubject::firstOrCreate([
            'grade_id'   => $data['grade_id'],
            'subject_id' => $subject->id,
            'track'      => $data['track'] ?? null,
        ]);

        \App\Models\ActivityLog::log('updated', 'Subject', "Assigned subject to grade: {$subject->name_en}");

        return redirect()
            ->route('admin.subjects.edit', $subject)
            ->with('success', 'មុខវិជ្ជាត្រូវបានចាត់តាំងទៅថ្នាក់ដោយជោគជ័យ។');
    }

    // POST /admin/subjects/{subject}/remove-grade
    public function removeFromGrade(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'track'    => 'nullable|in:science,social_science',
        ]);

        GradeSubject::where([
            'grade_id'   => $data['grade_id'],
            'subject_id' => $subject->id,
            'track'      => $data['track'] ?? null,
        ])->delete();

        \App\Models\ActivityLog::log('updated', 'Subject', "Removed subject from grade: {$subject->name_en}");

        return redirect()
            ->route('admin.subjects.edit', $subject)
            ->with('success', 'មុខវិជ្ជាត្រូវបានដកចេញពីថ្នាក់ដោយជោគជ័យ។');
    }
}
