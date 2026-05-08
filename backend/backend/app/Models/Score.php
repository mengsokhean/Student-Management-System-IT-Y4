<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\Subject;

class Score extends Model
{
    protected $fillable = [
        'student_id',
        'subject_id',
        'assignment_score',
        'midterm_score',
        'final_score',
        'average_score',
        'grade',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}