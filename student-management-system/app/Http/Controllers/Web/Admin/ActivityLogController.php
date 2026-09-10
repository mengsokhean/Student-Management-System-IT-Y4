<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the activity logs.
     */
    public function index(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->orderByDesc('created_at')
            ->paginate(20);

        return view('admin.logs.index', compact('logs'));
    }
}
