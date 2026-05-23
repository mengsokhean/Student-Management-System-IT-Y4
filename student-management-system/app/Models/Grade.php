<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = ['level', 'name'];

    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'grade_subject')
                    ->withPivot('track')
                    ->withTimestamps();
    }
}