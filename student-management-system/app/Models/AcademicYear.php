<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = ['name', 'start_date', 'end_date', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }

    public function scores()
    {
        return $this->hasMany(Score::class);
    }
}