<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    protected $fillable = [
        'user_id', 'teacher_code', 'name_kh', 'name_en',
        'phone', 'photo', 'gender',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function homeroomClassroom()
    {
        return $this->hasOne(ClassroomHomeroomTeacher::class);
    }

    public function teacherClassSubjects()
    {
        return $this->hasMany(TeacherClassSubject::class);
    }

    public function attendancesRecorded()
    {
        return $this->hasMany(Attendance::class, 'recorded_by');
    }

    public function scoresEntered()
    {
        return $this->hasMany(Score::class, 'entered_by');
    }
}