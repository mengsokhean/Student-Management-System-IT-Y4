<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $fillable = [
        'student_id', 'classroom_id', 'subject_id', 'academic_year_id',
        'semester', 'month1', 'month2', 'month3', 'month4',
        'exam_score', 'entered_by',
    ];

    protected $casts = [
        'month1'     => 'decimal:2',
        'month2'     => 'decimal:2',
        'month3'     => 'decimal:2',
        'month4'     => 'decimal:2',
        'exam_score' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function enteredBy()
    {
        return $this->belongsTo(TeacherProfile::class, 'entered_by');
    }

    public function getSemesterAvgAttribute(): ?float
    {
        $scores = [$this->month1, $this->month2, $this->month3, $this->month4, $this->exam_score];
        foreach ($scores as $s) {
            if (is_null($s)) return null;
        }
        return round((($this->month1 + $this->month2 + $this->month3 + $this->month4) + ($this->exam_score * 2)) / 6, 2);
    }
}