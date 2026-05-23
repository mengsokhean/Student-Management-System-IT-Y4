<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name_kh', 'name_en', 'code'];

    public function grades()
    {
        return $this->belongsToMany(Grade::class, 'grade_subject')
                    ->withPivot('track')
                    ->withTimestamps();
    }

    public function teacherClassSubjects()
    {
        return $this->hasMany(TeacherClassSubject::class);
    }
}