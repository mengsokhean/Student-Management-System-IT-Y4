<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\Admin\AdminAuthController;
use App\Http\Controllers\Web\Admin\AdminDashboardController;
use App\Http\Controllers\Web\Teacher\TeacherAuthController;
use App\Http\Controllers\Web\Teacher\TeacherDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| All Admin and Teacher portal routes live here.
| Authentication is standard Laravel session-based (no Sanctum tokens).
| Blade views are returned — this is pure Server-Side Rendering (SSR).
|--------------------------------------------------------------------------
*/

// ──────────────────────────────────────────────────────────────────────────
// PUBLIC REACT SPA ENTRY POINT
// Serves the built React app for the public-facing portal.
// All React client-side routing is handled by the catch-all below.
// ──────────────────────────────────────────────────────────────────────────
Route::get('/', function () {
    return redirect('/admin/login');
});

// Catch-all fallback: serve React SPA for any route not matched above
// (Excludes /admin, /teacher, and /api which are handled by Laravel)
Route::get('{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api|admin|teacher).*$');


// ══════════════════════════════════════════════════════════════════════════
//  SYSTEM B — ADMIN PORTAL (Laravel Blade + Session Auth)
// ══════════════════════════════════════════════════════════════════════════

// Admin Guest routes (only accessible when NOT logged in as admin)
Route::prefix('admin')->name('admin.')->middleware('guest:admin')->group(function () {
    Route::get('/login',  [AdminAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
});

// Admin Protected routes (only accessible when logged in as admin)
Route::prefix('admin')->name('admin.')->middleware('auth:admin')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Activity Logs
    Route::get('/logs', [\App\Http\Controllers\Web\Admin\ActivityLogController::class, 'index'])->name('logs.index');

    // Academic Years
    Route::resource('academic-years', \App\Http\Controllers\Web\Admin\AcademicYearController::class);

    // Grades
    Route::resource('grades', \App\Http\Controllers\Web\Admin\GradeController::class);

    // Subjects
    Route::resource('subjects', \App\Http\Controllers\Web\Admin\SubjectController::class);
    Route::post('subjects/{subject}/assign-grade', [\App\Http\Controllers\Web\Admin\SubjectController::class, 'assignToGrade'])->name('subjects.assign-grade');
    Route::post('subjects/{subject}/remove-grade', [\App\Http\Controllers\Web\Admin\SubjectController::class, 'removeFromGrade'])->name('subjects.remove-grade');

    // Articles (News & Announcements)
    Route::resource('articles', \App\Http\Controllers\Web\Admin\ArticleController::class);

    // Classrooms
    Route::resource('classrooms', \App\Http\Controllers\Web\Admin\ClassroomController::class);
    Route::get('classrooms/{classroom}/assign-subjects',  [\App\Http\Controllers\Web\Admin\ClassroomController::class, 'assignSubjects'])->name('classrooms.assign-subjects');
    Route::post('classrooms/{classroom}/assign-subjects', [\App\Http\Controllers\Web\Admin\ClassroomController::class, 'storeSubjectAssignments'])->name('classrooms.store-assignments');

    // Teachers
    Route::get('teachers/export',           [\App\Http\Controllers\Web\Admin\TeacherController::class, 'export'])->name('teachers.export');
    Route::resource('teachers', \App\Http\Controllers\Web\Admin\TeacherController::class);
    Route::post('teachers/assign-homeroom', [\App\Http\Controllers\Web\Admin\TeacherController::class, 'assignHomeroom'])->name('teachers.assign-homeroom');
    Route::post('teachers/assign-subject',  [\App\Http\Controllers\Web\Admin\TeacherController::class, 'assignSubject'])->name('teachers.assign-subject');
    Route::post('teachers/remove-subject',  [\App\Http\Controllers\Web\Admin\TeacherController::class, 'removeSubject'])->name('teachers.remove-subject');

    // Students (CRUD)
    Route::get('students/export',           [\App\Http\Controllers\Web\Admin\StudentController::class, 'export'])->name('students.export');
    Route::resource('students', \App\Http\Controllers\Web\Admin\StudentController::class);

    // Enrollment (actions on student-classroom pivot)
    Route::get('classrooms/{classroom}/students',   [\App\Http\Controllers\Web\Admin\StudentController::class, 'classroomStudents'])->name('enrollment.classroom-students');
    Route::get('enrollment',                         [\App\Http\Controllers\Web\Admin\StudentController::class, 'index'])->name('enrollment.index');
    Route::post('enrollment',                        [\App\Http\Controllers\Web\Admin\StudentController::class, 'store'])->name('enrollment.store');
    Route::post('enrollment/enroll',                 [\App\Http\Controllers\Web\Admin\StudentController::class, 'enroll'])->name('enrollment.enroll');
    Route::patch('enrollment/{student}/status',      [\App\Http\Controllers\Web\Admin\StudentController::class, 'updateStatus'])->name('enrollment.update-status');
});

// ══════════════════════════════════════════════════════════════════════════
//  SYSTEM B — TEACHER PORTAL (Laravel Blade + Session Auth)
// ══════════════════════════════════════════════════════════════════════════

// Teacher Guest routes (only accessible when NOT logged in as teacher)
Route::prefix('teacher')->name('teacher.')->middleware('guest:teacher')->group(function () {
    Route::get('/login',  [TeacherAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [TeacherAuthController::class, 'login'])->name('login.submit');
});

// Teacher Protected routes (only accessible when logged in as teacher)
Route::prefix('teacher')->name('teacher.')->middleware('auth:teacher')->group(function () {
    Route::post('/logout', [TeacherAuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');

    // My Classrooms & Students
    Route::get('my-classrooms',                     [\App\Http\Controllers\Web\Teacher\TeacherClassroomController::class, 'myClassrooms'])->name('classrooms.index');
    Route::get('classrooms/{classroomId}/students', [\App\Http\Controllers\Web\Teacher\TeacherClassroomController::class, 'classroomStudents'])->name('classrooms.students');

    // Attendance
    Route::get('attendance',                [\App\Http\Controllers\Web\Teacher\AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('attendance/bulk',          [\App\Http\Controllers\Web\Teacher\AttendanceController::class, 'bulkStore'])->name('attendance.bulk-store');
    Route::patch('attendance/{attendance}', [\App\Http\Controllers\Web\Teacher\AttendanceController::class, 'update'])->name('attendance.update');
    Route::get('attendance/student-report', [\App\Http\Controllers\Web\Teacher\AttendanceController::class, 'studentReport'])->name('attendance.student-report');

    // Scores
    Route::get('scores',              [\App\Http\Controllers\Web\Teacher\ScoreController::class, 'index'])->name('scores.index');
    Route::post('scores/bulk',        [\App\Http\Controllers\Web\Teacher\ScoreController::class, 'bulkStore'])->name('scores.bulk-store');
    Route::get('scores/annual-report', [\App\Http\Controllers\Web\Teacher\ScoreController::class, 'studentAnnualReport'])->name('scores.annual-report');
});
