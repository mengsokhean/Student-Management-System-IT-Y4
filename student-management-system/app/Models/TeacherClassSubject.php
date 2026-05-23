<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherClassSubject extends Model
{
    protected $table = 'teacher_class_subject';

    protected $fillable = ['teacher_profile_id', 'classroom_id', 'subject_id'];

    public function teacherProfile()
    {
        return $this->belongsTo(TeacherProfile::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}