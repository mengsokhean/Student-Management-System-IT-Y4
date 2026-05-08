<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ClassModel;

class Teacher extends Model
{
    protected $fillable = [
        'user_id',
        'teacher_code',
        'first_name',
        'last_name',
        'gender',
        'email',
        'phone',
        'specialization',
    ];

    public function classes()
    {
        return $this->hasMany(ClassModel::class);
    }
}