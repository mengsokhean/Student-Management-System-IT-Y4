<?php

$controllers = [
    [
        'file' => 'app/Http/Controllers/Web/Admin/AcademicYearController.php',
        'model' => 'AcademicYear',
        'var' => '$academicYear',
        'name_field' => 'name'
    ],
    [
        'file' => 'app/Http/Controllers/Web/Admin/ClassroomController.php',
        'model' => 'Classroom',
        'var' => '$classroom',
        'name_field' => 'name'
    ],
    [
        'file' => 'app/Http/Controllers/Web/Admin/GradeController.php',
        'model' => 'Grade',
        'var' => '$grade',
        'name_field' => 'level'
    ],
    [
        'file' => 'app/Http/Controllers/Web/Admin/StudentController.php',
        'model' => 'Student',
        'var' => '$student',
        'name_field' => 'name_en'
    ],
    [
        'file' => 'app/Http/Controllers/Web/Admin/SubjectController.php',
        'model' => 'Subject',
        'var' => '$subject',
        'name_field' => 'name'
    ],
    [
        'file' => 'app/Http/Controllers/Web/Admin/TeacherController.php',
        'model' => 'TeacherProfile',
        'var' => '$teacher',
        'name_field' => 'name_en' // teacher profile has name_en
    ]
];

foreach ($controllers as $c) {
    $path = "C:/Users/USER/Desktop/STUDENT MANAGEMENT SYSTEM/student-management-system/" . $c['file'];
    if (!file_exists($path)) {
        echo "Missing: $path\n";
        continue;
    }

    $content = file_get_contents($path);

    // STORE
    // Match Model::create($data) or $var = Model::create($data)
    // We will just find "create($data);" or similar and append our log
    // Usually it's either Model::create($data) or $var = Model::create($data)
    $patternStore = '/('.$c['model'].'::create\([^;]+;\s*|'.$c['var'].'\s*=\s*'.$c['model'].'::create\([^;]+;\s*|'.$c['var'].'\s*=\s*User::create\([^;]+;\s*.*Profile::create\([^;]+;\s*)/s';
    
    // Actually, Student and Teacher are complex because they create a User first, then the Profile.
    // Let's just insert before `return redirect()` in all methods. This is much safer.
    
    // Store
    $content = preg_replace(
        '/(\s*)(return redirect\(\)\s*->route\([^)]+\.index[^;]+;)/s',
        function ($matches) use ($c) {
            // Check context to determine which log to add.
            // But wait, there are multiple `return redirect()` in a file (store, update, destroy).
            return $matches[0];
        },
        $content
    );
    // That's too complex with regex if we only match return redirect.
}
?>
