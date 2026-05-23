<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_id', 'classroom_id', 'recorded_by',
        'date', 'status', 'note',
    ];

    protected $casts = ['date' => 'date'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(TeacherProfile::class, 'recorded_by');
    }
}