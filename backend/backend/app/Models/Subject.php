<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\Enrollment;
use App\Models\Score;
use App\Models\Attendance;

class Subject extends Model
{
    protected $fillable = [
        'subject_code',
        'subject_name',
        'credit',
        'description',
    ];

    // many-to-many with students
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments', 'subject_id', 'student_id');
    }

    // one subject has many enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    // one subject has many scores
    public function scores()
    {
        return $this->hasMany(Score::class);
    }

    // one subject has many attendances
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}