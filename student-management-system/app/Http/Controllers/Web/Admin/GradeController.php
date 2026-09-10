<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends Controller
{
    // GET /admin/grades
    public function index()
    {
        $grades = Grade::withCount('classrooms')->orderBy('level')->get();

        return view('admin.grades.index', compact('grades'));
    }

    // GET /admin/grades/create
    public function create()
    {
        return view('admin.grades.create');
    }

    // POST /admin/grades
    public function store(Request $request)
    {
        $data = $request->validate([
            'level' => 'required|integer|unique:grades,level',
            'name'  => 'required|string|max:50',
        ]);

        Grade::create($data);

        \App\Models\ActivityLog::log('created', 'Grade', "Created grade level: {$data['level']}");

        return redirect()
            ->route('admin.grades.index')
            ->with('success', 'កម្រិតថ្នាក់ត្រូវបានបន្ថែមដោយជោគជ័យ។');
    }

    // GET /admin/grades/{grade}
    public function show(Grade $grade)
    {
        $grade->load(['classrooms', 'subjects']);
        
        return view('admin.grades.show', compact('grade'));
    }

    // GET /admin/grades/{grade}/edit
    public function edit(Grade $grade)
    {
        return view('admin.grades.edit', compact('grade'));
    }

    // PUT /admin/grades/{grade}
    public function update(Request $request, Grade $grade)
    {
        $data = $request->validate([
            'level' => 'required|integer|unique:grades,level,' . $grade->id,
            'name'  => 'required|string|max:50',
        ]);

        $grade->update($data);

        \App\Models\ActivityLog::log('updated', 'Grade', "Updated grade level: {$grade->level}");

        return redirect()
            ->route('admin.grades.index')
            ->with('success', 'កម្រិតថ្នាក់ត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // DELETE /admin/grades/{grade}
    public function destroy(Grade $grade)
    {
        // Prevent deletion if there are classrooms tied to it
        if ($grade->classrooms()->exists()) {
            return back()->withErrors(['error' => 'មិនអាចលុបកម្រិតថ្នាក់នេះបានទេ ព្រោះមានថ្នាក់រៀនកំពុងប្រើប្រាស់វា។']);
        }

        $grade->delete();

        \App\Models\ActivityLog::log('deleted', 'Grade', "Deleted grade level: {$grade->level}");

        return redirect()
            ->route('admin.grades.index')
            ->with('success', 'កម្រិតថ្នាក់ត្រូវបានលុបដោយជោគជ័យ។');
    }
}
