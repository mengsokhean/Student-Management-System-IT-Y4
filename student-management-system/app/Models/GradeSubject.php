<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeSubject extends Model
{
    protected $table = 'grade_subject';

    protected $fillable = ['grade_id', 'subject_id', 'track'];

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}