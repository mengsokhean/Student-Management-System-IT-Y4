<?php

use App\Http\Controllers\Api\Admin\AcademicYearController;
use App\Http\Controllers\Api\Admin\ClassroomController;
use App\Http\Controllers\Api\Admin\EnrollmentController;
use App\Http\Controllers\Api\Admin\GradeController;
use App\Http\Controllers\Api\Admin\SubjectController;
use App\Http\Controllers\Api\Admin\TeacherController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Teacher\AttendanceController;
use App\Http\Controllers\Api\Teacher\ScoreController;
use App\Http\Controllers\Api\Teacher\TeacherClassroomController;
use App\Http\Controllers\Api\Student\StudentProfileController;
use App\Http\Controllers\Api\Student\StudentAttendanceController;
use App\Http\Controllers\Api\Student\StudentReportCardController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',     [AuthController::class, 'me']);

    // ─── ADMIN ───────────────────────────────────────────
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::apiResource('academic-years', AcademicYearController::class);
        Route::get('grades',          [GradeController::class, 'index']);
        Route::get('grades/{grade}',  [GradeController::class, 'show']);
        Route::apiResource('subjects', SubjectController::class);
        Route::post('subjects/{subject}/assign-grade', [SubjectController::class, 'assignToGrade']);
        Route::post('subjects/{subject}/remove-grade', [SubjectController::class, 'removeFromGrade']);
        Route::apiResource('classrooms', ClassroomController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::post('teachers/assign-homeroom', [TeacherController::class, 'assignHomeroom']);
        Route::post('teachers/assign-subject',  [TeacherController::class, 'assignSubject']);
        Route::post('teachers/remove-subject',  [TeacherController::class, 'removeSubject']);
        Route::get('classrooms/{classroom}/students', [EnrollmentController::class, 'classroomStudents']);
        Route::post('enrollment',                     [EnrollmentController::class, 'store']);
        Route::post('enrollment/enroll',              [EnrollmentController::class, 'enroll']);
        Route::patch('enrollment/{student}/status',   [EnrollmentController::class, 'updateStatus']);
    });

    // ─── TEACHER ─────────────────────────────────────────
    Route::middleware('role:teacher')->prefix('teacher')->group(function () {
        Route::get('my-classrooms',                     [TeacherClassroomController::class, 'myClassrooms']);
        Route::get('classrooms/{classroomId}/students', [TeacherClassroomController::class, 'classroomStudents']);
        Route::get('attendance',                 [AttendanceController::class, 'index']);
        Route::post('attendance/bulk',           [AttendanceController::class, 'bulkStore']);
        Route::patch('attendance/{attendance}',  [AttendanceController::class, 'update']);
        Route::get('attendance/student-report',  [AttendanceController::class, 'studentReport']);
        Route::get('scores',                     [ScoreController::class, 'index']);
        Route::post('scores/bulk',               [ScoreController::class, 'bulkStore']);
        Route::get('scores/annual-report',       [ScoreController::class, 'studentAnnualReport']);
    });

    // ─── STUDENT ─────────────────────────────────────────
    Route::middleware('role:student')->prefix('student')->group(function () {
        Route::get('profile',      [StudentProfileController::class, 'show']);
        Route::get('attendance',   [StudentAttendanceController::class, 'index']);
        Route::get('report-card',  [StudentReportCardController::class, 'show']);
    });
});