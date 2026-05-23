<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentProfileController extends Controller
{
    public function show(Request $request)
    {
        $student = Student::where('user_id', $request->user()->id)
            ->with([
                'classrooms.grade',
                'classrooms.academicYear',
            ])
            ->firstOrFail();

        return response()->json($student);
    }
}