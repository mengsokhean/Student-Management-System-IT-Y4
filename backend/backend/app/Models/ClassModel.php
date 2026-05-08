<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'class_name',
        'grade',
        'section',
    ];

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }
}