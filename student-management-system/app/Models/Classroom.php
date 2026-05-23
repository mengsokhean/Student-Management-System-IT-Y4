<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable = ['academic_year_id', 'grade_id', 'name', 'track', 'max_students'];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_classroom')
                    ->withPivot('status', 'enrolled_at')
                    ->withTimestamps();
    }

    public function homeroomTeacher()
    {
        return $this->hasOne(ClassroomHomeroomTeacher::class);
    }

    public function teacherClassSubjects()
    {
        return $this->hasMany(TeacherClassSubject::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function scores()
    {
        return $this->hasMany(Score::class);
    }
}