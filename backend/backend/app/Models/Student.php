<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ClassModel;
use App\Models\Enrollment;
use App\Models\Subject;
use App\Models\Score;
use App\Models\Attendance;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'class_id',
        'student_code',
        'first_name',
        'last_name',
        'gender',
        'date_of_birth',
        'email',
        'phone',
        'address',
        'status',
    ];
    public function classroom()
    {
        return $this->belongsTo(ClassModel::class, 'class_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'enrollments', 'student_id', 'subject_id');
    }

    public function scores()
    {
        return $this->hasMany(Score::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
