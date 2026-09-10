<?php
$files = [
    [
        'path' => 'C:/Users/USER/Desktop/STUDENT MANAGEMENT SYSTEM/student-management-system/resources/views/admin/academic-years/index.blade.php',
        'colspan' => '6', 'icon' => 'calendar_today',
        'title' => 'មិនទាន់មានទិន្នន័យឆ្នាំសិក្សាទេ',
        'desc' => 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតឆ្នាំសិក្សាថ្មី។',
        'route' => 'admin.academic-years.create',
        'btn' => 'បង្កើតឆ្នាំសិក្សា'
    ],
    [
        'path' => 'C:/Users/USER/Desktop/STUDENT MANAGEMENT SYSTEM/student-management-system/resources/views/admin/subjects/index.blade.php',
        'colspan' => '6', 'icon' => 'menu_book',
        'title' => 'មិនទាន់មានទិន្នន័យមុខវិជ្ជាទេ',
        'desc' => 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតមុខវិជ្ជាថ្មី។',
        'route' => 'admin.subjects.create',
        'btn' => 'បង្កើតមុខវិជ្ជា'
    ],
    [
        'path' => 'C:/Users/USER/Desktop/STUDENT MANAGEMENT SYSTEM/student-management-system/resources/views/admin/classrooms/index.blade.php',
        'colspan' => '7', 'icon' => 'meeting_room',
        'title' => 'មិនទាន់មានទិន្នន័យថ្នាក់រៀនទេ',
        'desc' => 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតថ្នាក់រៀនថ្មី។',
        'route' => 'admin.classrooms.create',
        'btn' => 'បង្កើតថ្នាក់រៀនថ្មី'
    ],
    [
        'path' => 'C:/Users/USER/Desktop/STUDENT MANAGEMENT SYSTEM/student-management-system/resources/views/admin/teachers/index.blade.php',
        'colspan' => '7', 'icon' => 'person_off',
        'title' => 'មិនទាន់មានទិន្នន័យគ្រូបង្រៀនទេ',
        'desc' => 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតគ្រូបង្រៀនថ្មី។',
        'route' => 'admin.teachers.create',
        'btn' => 'បង្កើតគ្រូបង្រៀនថ្មី'
    ],
    [
        'path' => 'C:/Users/USER/Desktop/STUDENT MANAGEMENT SYSTEM/student-management-system/resources/views/admin/students/index.blade.php',
        'colspan' => '7', 'icon' => 'groups',
        'title' => 'មិនទាន់មានទិន្នន័យសិស្សទេ',
        'desc' => 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីចុះឈ្មោះសិស្សថ្មី។',
        'route' => 'admin.students.create',
        'btn' => 'ចុះឈ្មោះសិស្សថ្មី'
    ]
];

foreach ($files as $file) {
    if (!file_exists($file['path'])) {
        echo "File not found: " . $file['path'] . "\n";
        continue;
    }
    $content = file_get_contents($file['path']);
    
    $replacement = "@empty\n" .
                   "                    <x-empty-state \n" .
                   "                        colspan=\"{$file['colspan']}\"\n" .
                   "                        icon=\"{$file['icon']}\"\n" .
                   "                        title=\"{$file['title']}\"\n" .
                   "                        description=\"{$file['desc']}\"\n" .
                   "                        action_url=\"{{ route('{$file['route']}') }}\"\n" .
                   "                        action_text=\"{$file['btn']}\"\n" .
                   "                    />\n" .
                   "                @endforelse";

    if (strpos($file['path'], 'classrooms') !== false) {
        // Fix the broken classrooms file that lacks @endforelse
        // It has a broken pagination include string like this: "    {{-- "?"? Pagination "?"? --}}"
        // Let's replace from @empty to just before the pagination container
        $pattern = '/@empty\s*<tr>\s*<td colspan="7".*?(?=<\/tbody>)/s';
        $content = preg_replace($pattern, $replacement . "\n                    ", $content);
    } else {
        $pattern = '/@empty\s*<tr>\s*<td colspan="' . $file['colspan'] . '".*?@endforelse/s';
        $content = preg_replace($pattern, $replacement, $content);
    }
    
    if (file_put_contents($file['path'], $content) !== false) {
        echo "Successfully updated: " . $file['path'] . "\n";
    } else {
        echo "Failed to write: " . $file['path'] . "\n";
    }
}
