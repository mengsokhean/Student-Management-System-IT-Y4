<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        return response()->json(AcademicYear::orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|unique:academic_years,name',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
            'is_active'  => 'boolean',
        ]);

        if (!empty($data['is_active']) && $data['is_active']) {
            AcademicYear::query()->update(['is_active' => false]);
        }

        $year = AcademicYear::create($data);

        return response()->json($year, 201);
    }

    public function show(AcademicYear $academicYear)
    {
        return response()->json($academicYear);
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $data = $request->validate([
            'name'       => 'sometimes|string|unique:academic_years,name,' . $academicYear->id,
            'start_date' => 'sometimes|date',
            'end_date'   => 'sometimes|date|after:start_date',
            'is_active'  => 'boolean',
        ]);

        if (!empty($data['is_active']) && $data['is_active']) {
            AcademicYear::query()->update(['is_active' => false]);
        }

        $academicYear->update($data);

        return response()->json($academicYear);
    }

    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
}