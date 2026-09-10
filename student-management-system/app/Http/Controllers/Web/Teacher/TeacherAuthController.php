<?php

namespace App\Http\Controllers\Web\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherAuthController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────
    // Show the Teacher login form
    // GET /teacher/login
    // ──────────────────────────────────────────────────────────────────────
    public function showLoginForm()
    {
        return view('teacher.login');
    }

    // ──────────────────────────────────────────────────────────────────────
    // Handle login form submission
    // POST /teacher/login
    // ──────────────────────────────────────────────────────────────────────
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Attempt login against the 'teacher' guard
        if (!Auth::guard('teacher')->attempt($credentials, $request->boolean('remember'))) {
            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'email' => 'ព័ត៌មានចូលប្រើប្រាស់មិនត្រឹមត្រូវ។', // Incorrect credentials
                ]);
        }

        $user = Auth::guard('teacher')->user();

        // Enforce role — even if credentials match, reject non-teachers
        if ($user->role !== 'teacher') {
            Auth::guard('teacher')->logout();
            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'email' => 'គណនីនេះមិនមានសិទ្ធិជា Teacher ទេ។', // Account is not a teacher
                ]);
        }

        // Enforce active status
        if (!$user->is_active) {
            Auth::guard('teacher')->logout();
            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'email' => 'គណនីត្រូវបានបិទ។ សូមទាក់ទងអ្នកគ្រប់គ្រង។', // Account is disabled
                ]);
        }

        // Regenerate session to prevent session fixation attacks
        $request->session()->regenerate();

        return redirect()->intended(route('teacher.dashboard'));
    }

    // ──────────────────────────────────────────────────────────────────────
    // Handle logout
    // POST /teacher/logout
    // ──────────────────────────────────────────────────────────────────────
    public function logout(Request $request)
    {
        Auth::guard('teacher')->logout();

        // Invalidate the session and regenerate the CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('teacher.login');
    }
}
