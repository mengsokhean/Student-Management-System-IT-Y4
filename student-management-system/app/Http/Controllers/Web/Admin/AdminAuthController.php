<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────
    // Show the Admin login form
    // GET /admin/login
    // ──────────────────────────────────────────────────────────────────────
    public function showLoginForm()
    {
        return view('admin.login');
    }

    // ──────────────────────────────────────────────────────────────────────
    // Handle login form submission
    // POST /admin/login
    // ──────────────────────────────────────────────────────────────────────
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Attempt login against the 'admin' guard
        if (!Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'email' => 'ព័ត៌មានចូលប្រើប្រាស់មិនត្រឹមត្រូវ។', // Incorrect credentials
                ]);
        }

        $user = Auth::guard('admin')->user();

        // Enforce role — even if credentials match, reject non-admins
        if ($user->role !== 'admin') {
            Auth::guard('admin')->logout();
            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'email' => 'គណនីនេះមិនមានសិទ្ធិជា Admin ទេ។', // Account is not an admin
                ]);
        }

        // Enforce active status
        if (!$user->is_active) {
            Auth::guard('admin')->logout();
            return back()
                ->withInput($request->only('email'))
                ->withErrors([
                    'email' => 'គណនីត្រូវបានបិទ។ សូមទាក់ទងអ្នកគ្រប់គ្រង។', // Account is disabled
                ]);
        }

        // Regenerate session to prevent session fixation attacks
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    // ──────────────────────────────────────────────────────────────────────
    // Handle logout
    // POST /admin/logout
    // ──────────────────────────────────────────────────────────────────────
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        // Invalidate the session and regenerate the CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
