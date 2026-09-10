<?php
$files = [
    'resources/views/admin/classrooms/index.blade.php',
    'resources/views/admin/subjects/index.blade.php',
    'resources/views/admin/academic-years/index.blade.php',
];

$importExportBtns = <<<HTML
        {{-- Import Button --}}
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_download</span>
            Import
        </button>
        {{-- Export Button --}}
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_upload</span>
            Export
        </button>
HTML;

$checkboxTh = <<<HTML
                    <th class="w-12 px-5 py-3 text-center font-semibold">
                        <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    </th>
HTML;

$checkboxTd = <<<HTML
                        <td class="px-5 py-4 text-center">
                            <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                        </td>
HTML;

foreach ($files as $file) {
    $path = "C:\\Users\\USER\\Desktop\\STUDENT MANAGEMENT SYSTEM\\student-management-system\\" . $file;
    if (!file_exists($path)) continue;

    $content = file_get_contents($path);

    // 1. Insert Import/Export before the add button
    $content = preg_replace(
        '/(@section\(\'header-actions\'\)\s*)(<a href="\{\{ route\(\'admin\.[a-z-]+\.create\'\)[^>]+>)/',
        "$1<div class=\"flex items-center gap-2\">\n$importExportBtns\n        $2",
        $content
    );
    // Close the div before @endsection
    $content = preg_replace(
        '/(\s*<\/a>\s*)(@endsection)/',
        "$1    </div>\n$2",
        $content
    );

    // 2. Insert Checkbox Header
    $content = preg_replace(
        '/(<tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">\s*)(<th)/',
        "$1$checkboxTh\n                    $2",
        $content
    );

    // 3. Insert Checkbox Body
    $content = preg_replace(
        '/(<tr class="hover:bg-slate-50 transition-colors[^"]*">\s*)(<td)/',
        "$1$checkboxTd\n                        $2",
        $content
    );

    // 4. Update Empty State colspan
    $content = preg_replace_callback(
        '/<x-empty-state\s+colspan="(\d+)"/',
        function($matches) {
            $newVal = (int)$matches[1] + 1;
            return '<x-empty-state ' . "\n" . '                        colspan="' . $newVal . '"';
        },
        $content
    );

    file_put_contents($path, $content);
}
echo "Done";
