<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    public function index()
    {
        $classes = ClassModel::withCount('students')->get();

        return response()->json([
            'success' => true,
            'data' => $classes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_name' => 'required|string|max:255',
            'grade'      => 'required|integer',
            'section'    => 'required|string|max:50',
        ]);

        $class = ClassModel::create($validated);

        return response()->json([
            'success' => true,
            'data' => $class
        ], 201);
    }

    public function show(int $id)
    {
        $class = ClassModel::with('students')->find($id);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Class not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $class
        ]);
    }

    public function update(Request $request,int $id)
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Class not found'
            ], 404);
        }

        $validated = $request->validate([
            'class_name' => 'required|string|max:255',
            'grade'      => 'required|integer',
            'section'    => 'required|string|max:50',
        ]);

        $class->update($validated);

        return response()->json([
            'success' => true,
            'data' => $class
        ]);
    }

    public function destroy(int $id)
    {
        $class = ClassModel::find($id);

        if (!$class) {
            return response()->json([
                'success' => false,
                'message' => 'Class not found'
            ], 404);
        }

        $class->delete();

        return response()->json([
            'success' => true,
            'message' => 'Class deleted'
        ]);
    }
}