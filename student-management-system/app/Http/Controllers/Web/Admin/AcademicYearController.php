<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    // GET /admin/academic-years
    public function index()
    {
        $academicYears = AcademicYear::orderByDesc('id')->get();

        return view('admin.academic-years.index', compact('academicYears'));
    }

    // GET /admin/academic-years/create
    public function create()
    {
        return view('admin.academic-years.create');
    }

    // POST /admin/academic-years
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
            'is_active'  => 'boolean',
        ]);

        // Only one academic year can be active at a time
        if (!empty($data['is_active'])) {
            AcademicYear::query()->update(['is_active' => false]);
        }

        AcademicYear::create($data);

        \App\Models\ActivityLog::log('created', 'AcademicYear', "Created academic year: {$data['name']}");

        return redirect()
            ->route('admin.academic-years.index')
            ->with('success', 'ឆ្នាំសិក្សាត្រូវបានបន្ថែមដោយជោគជ័យ។');
    }

    // GET /admin/academic-years/{academicYear}/edit
    public function edit(AcademicYear $academicYear)
    {
        return view('admin.academic-years.edit', compact('academicYear'));
    }

    // PUT /admin/academic-years/{academicYear}
    public function update(Request $request, AcademicYear $academicYear)
    {
        $data = $request->validate([
            'name'       => 'required|string|unique:academic_years,name,' . $academicYear->id,
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
            'is_active'  => 'boolean',
        ]);

        // Only one academic year can be active at a time
        if (!empty($data['is_active'])) {
            AcademicYear::query()->update(['is_active' => false]);
        }

        $academicYear->update($data);

        \App\Models\ActivityLog::log('updated', 'AcademicYear', "Updated academic year: {$academicYear->name}");

        return redirect()
            ->route('admin.academic-years.index')
            ->with('success', 'ឆ្នាំសិក្សាត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // DELETE /admin/academic-years/{academicYear}
    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();

        \App\Models\ActivityLog::log('deleted', 'AcademicYear', "Deleted academic year: {$academicYear->name}");

        return redirect()
            ->route('admin.academic-years.index')
            ->with('success', 'ឆ្នាំសិក្សាត្រូវបានលុបដោយជោគជ័យ។');
    }
}
