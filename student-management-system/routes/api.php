<?php

use App\Http\Controllers\Api\PublicResultController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\AttendanceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — PUBLIC REACT WEBSITE ONLY
|--------------------------------------------------------------------------
| These routes serve the public-facing React SPA.
| NO auth:sanctum here. NO admin. NO teacher. NO private data.
|
| Admin and Teacher portals are served exclusively by Laravel Blade (SSR)
| via routes/web.php with standard session-based authentication.
|--------------------------------------------------------------------------
*/

Route::prefix('public')->group(function () {

    Route::get('/stats',    [PublicController::class, 'getStats']);
    Route::get('/articles', [PublicController::class, 'getArticles']);
    Route::get('/articles/{slug}', [PublicController::class, 'showArticle']);

    // Rate-limited: 10 attempts per minute per IP
    // POST /api/public/verify-student
    Route::middleware(['throttle:10,1'])->group(function () {
        Route::post('/verify-student', [PublicResultController::class, 'verify']);
    });

    // Rate-limited: 30 requests per minute per IP
    // GET /api/public/student-result/{studentId}
    Route::middleware(['throttle:30,1'])->group(function () {
        Route::get('/student-result/{studentId}', [PublicResultController::class, 'show']);
    });
});

Route::prefix('admin')->group(function () {
    Route::get('/students',   [\App\Http\Controllers\Web\Admin\StudentController::class, 'index']);
    Route::get('/teachers',   [\App\Http\Controllers\Web\Admin\TeacherController::class, 'index']);
    Route::get('/classes',    [\App\Http\Controllers\Web\Admin\ClassroomController::class, 'index']);
    Route::get('/classrooms', [\App\Http\Controllers\Web\Admin\ClassroomController::class, 'index']);
    Route::get('/subjects',   [\App\Http\Controllers\Web\Admin\SubjectController::class, 'index']);

    Route::prefix('attendance')->group(function () {
        Route::get('/classrooms', [AttendanceController::class, 'classrooms']);
        Route::get('/students',   [AttendanceController::class, 'students']);
        Route::post('/bulk',      [AttendanceController::class, 'bulkStore']);
        Route::get('/report',     [AttendanceController::class, 'report']);
    });
});
