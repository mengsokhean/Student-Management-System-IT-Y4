<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Grade;

class GradeController extends Controller
{
    public function index()
    {
        return response()->json(Grade::with('subjects')->orderBy('level')->get());
    }

    public function show(Grade $grade)
    {
        return response()->json($grade->load('subjects'));
    }
}