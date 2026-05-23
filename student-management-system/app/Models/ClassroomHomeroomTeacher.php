<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassroomHomeroomTeacher extends Model
{
    protected $table = 'classroom_homeroom_teacher';

    protected $fillable = ['classroom_id', 'teacher_profile_id'];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function teacherProfile()
    {
        return $this->belongsTo(TeacherProfile::class);
    }
}