@extends('layouts.admin')

@section('title', 'សិស្ស')
@section('page-title', 'សិស្ស')
@section('breadcrumb')
    <span class="text-slate-500">សិស្ស</span>
@endsection

@section('header-actions')
    <div class="flex items-center gap-2">
        {{-- Import Button --}}
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_download</span>
            Import
        </button>
        {{-- Export Button --}}
        <a href="{{ route('admin.students.export') }}" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_upload</span>
            Export
        </a>
        {{-- Add New --}}
        <a href="{{ route('admin.students.create') }}" class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30">
            <span class="material-icons-round text-[18px]">person_add</span>
            <span>ចុះឈ្មោះសិស្សថ្មី</span>
        </a>
    </div>
@endsection

@section('content')

{{-- ── Stats Row ── --}}
<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
    @foreach([
        ['label' => 'សិស្សសរុប',     'value' => $totalStudents, 'icon' => 'groups',        'color' => 'indigo'],
        ['label' => 'សិស្សប្រុស',           'value' => $maleStudents,        'icon' => 'face',           'color' => 'sky'],
        ['label' => 'សិស្សស្រី',            'value' => $femaleStudents,      'icon' => 'face_3',         'color' => 'pink'],
        ['label' => 'កំពុងរៀន',       'value' => $enrolledStudents, 'icon' => 'school',      'color' => 'emerald'],
    ] as $card)
        <div class="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm">
            <div class="w-9 h-9 rounded-xl bg-{{ $card['color'] }}-50 border border-{{ $card['color'] }}-100
                        flex items-center justify-center flex-shrink-0">
                <span class="material-icons-round text-{{ $card['color'] }}-500 text-[18px]">{{ $card['icon'] }}</span>
            </div>
            <div>
                <p class="text-lg font-bold text-slate-800 leading-tight">{{ $card['value'] }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ $card['label'] }}</p>
            </div>
        </div>
    @endforeach
</div>

{{-- ── Students Table ── --}}
<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

    {{-- Table header + search --}}
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-2">
            <span class="material-icons-round text-indigo-500 text-[20px]">groups</span>
            <h2 class="font-semibold text-slate-800 text-sm">បញ្ជីសិស្ស</h2>
            <span class="ml-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs
                         px-2 py-0.5 rounded-full font-medium">{{ $students->total() }}</span>
            @if($search)
                <span class="ml-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span class="material-icons-round text-[12px]">filter_alt</span>
                    ស្វែងរក: &ldquo;{{ $search }}&rdquo;
                    <a href="{{ route('admin.students.index') }}" class="ml-1 hover:text-amber-900">
                        <span class="material-icons-round text-[12px]">close</span>
                    </a>
                </span>
            @endif
        </div>
        {{-- Live Search Form & Filters --}}
        <form method="GET" action="{{ route('admin.students.index') }}" id="studentFilterForm" class="flex items-center gap-2">
            <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px] pointer-events-none">search</span>
                <input type="text"
                       id="studentSearchInput"
                       name="search"
                       value="{{ $search }}"
                       placeholder="ស្វែងរកសិស្ស…"
                       autocomplete="off"
                       class="bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all">
                @if($search)
                    <a href="{{ route('admin.students.index', array_filter(['classroom_id' => $classroomId])) }}" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" title="សំអាត">
                        <span class="material-icons-round text-[16px]">cancel</span>
                    </a>
                @endif
            </div>
            
            <select name="classroom_id" class="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all max-w-[200px]">
                <option value="">ជ្រើសរើសថ្នាក់រៀន</option>
                @foreach($classroomsList as $cr)
                    <option value="{{ $cr->id }}" {{ (isset($classroomId) && (string)$classroomId === (string)$cr->id) ? 'selected' : '' }}>{{ $cr->name }}</option>
                @endforeach
            </select>

            <button type="submit" class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors shadow-sm">
                <span class="material-icons-round text-[16px]">search</span>
                ស្វែងរក
            </button>
        </form>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[820px]">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                    <th class="w-12 px-5 py-3 text-center font-semibold">
                        <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">
                        <div class="flex items-center gap-1">
                            <span class="material-icons-round text-[14px]">badge</span>
                            លេខកូដ
                        </div>
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">ឈ្មោះ (ខ្មែរ)</th>
                    <th class="px-5 py-3 text-center font-semibold">ភេទ</th>
                    <th class="px-5 py-3 text-left font-semibold">
                        <div class="flex items-center gap-1">
                            <span class="material-icons-round text-[14px]">meeting_room</span>
                            ថ្នាក់បច្ចុប្បន្ន
                        </div>
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">
                        <div class="flex items-center gap-1">
                            <span class="material-icons-round text-[14px]">phone</span>
                            ទូរស័ព្ទ​​ (ស្វែងរកសាធារណៈ)
                        </div>
                    </th>
                    <th class="px-5 py-3 text-center font-semibold">ស្ថានភាព</th>
                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($students as $student)
                    @php
                        $activeClass = $student->classrooms->first();
                    @endphp
                    <tr class="hover:bg-slate-50 transition-colors group">

                        <td class="px-5 py-4 text-center">
                            <input type="checkbox" value="{{ $student->id }}" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                        </td>

                        {{-- Student Code --}}
                        <td class="px-5 py-4">
                            <span class="inline-flex items-center bg-rose-50 border border-rose-200
                                         text-rose-600 font-mono text-xs px-2.5 py-1 rounded-lg">
                                {{ $student->student_code }}
                            </span>
                        </td>

                        {{-- Name + EN sub --}}
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center
                                            {{ $student->gender === 'female'
                                                ? 'bg-pink-50 border border-pink-200'
                                                : 'bg-sky-50 border border-sky-200' }}">
                                    <span class="material-icons-round text-[18px]
                                                 {{ $student->gender === 'female' ? 'text-pink-500' : 'text-sky-500' }}">
                                        {{ $student->gender === 'female' ? 'face_3' : 'face' }}
                                    </span>
                                </div>
                                <div>
                                    <p class="font-medium text-slate-800">{{ $student->name_kh }}</p>
                                    <p class="text-xs text-slate-500 mt-0.5">{{ $student->name_en }}</p>
                                </div>
                            </div>
                        </td>

                        {{-- Gender --}}
                        <td class="px-5 py-4 text-center">
                            @if($student->gender === 'female')
                                <span class="inline-flex items-center gap-1 bg-pink-50 border border-pink-200
                                             text-pink-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                    <span class="material-icons-round text-[12px]">female</span>ស្រី
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 bg-sky-50 border border-sky-200
                                             text-sky-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                    <span class="material-icons-round text-[12px]">male</span>ប្រុស
                                </span>
                            @endif
                        </td>

                        {{-- Active Classroom --}}
                        <td class="px-5 py-4">
                            @if($activeClass)
                                <div class="flex items-center gap-2">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold flex-shrink-0
                                                 @if($activeClass->track === 'science') bg-teal-50 border border-teal-200 text-teal-700
                                                 @elseif($activeClass->track === 'social_science') bg-amber-50 border border-amber-200 text-amber-700
                                                 @else bg-sky-50 border border-sky-200 text-sky-700 @endif">
                                        {{ $activeClass->grade?->level }}
                                    </span>
                                    <div>
                                        <p class="text-slate-800 text-sm font-medium">{{ $activeClass->name }}</p>
                                        <p class="text-[11px] text-slate-500">
                                            @if($activeClass->track === 'science') វិទ្យាសាស្ត្រ
                                            @elseif($activeClass->track === 'social_science') វិទ្យាសាស្ត្រសង្គម
                                            @else ទូទៅ @endif
                                        </p>
                                    </div>
                                </div>
                            @else
                                <span class="text-slate-400 text-xs italic">មិនទាន់ចុះឈ្មោះ</span>
                            @endif
                        </td>

                        {{-- Guardian Phone (public search key) --}}
                        <td class="px-5 py-4">
                            <span class="text-slate-500 text-xs font-mono">{{ $student->guardian_phone }}</span>
                        </td>

                        {{-- Status --}}
                        <td class="px-5 py-4 text-center">
                            @if($student->user?->is_active ?? $activeClass)
                                <span class="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200
                                             text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    សកម្ម
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 bg-slate-100 border border-slate-200
                                             text-slate-500 text-xs px-2.5 py-1 rounded-full font-medium">
                                    <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                    អសកម្ម
                                </span>
                            @endif
                        </td>

                        {{-- Actions --}}
                        <td class="px-5 py-4">
                            <div class="flex items-center justify-end gap-1
                                        opacity-60 group-hover:opacity-100 transition-opacity">
                                <a href="{{ route('admin.students.show', $student) }}"
                                   title="មើលប្រវត្តិរូប"
                                   class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                          bg-slate-100 hover:bg-sky-100 border border-slate-200
                                          hover:border-sky-300 text-slate-500 hover:text-sky-600 transition-all">
                                    <span class="material-icons-round text-[16px]">visibility</span>
                                </a>
                                <a href="{{ route('admin.students.edit', $student) }}"
                                   title="កែប្រែ"
                                   class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                          bg-slate-100 hover:bg-indigo-100 border border-slate-200
                                          hover:border-indigo-300 text-slate-500 hover:text-indigo-600 transition-all">
                                    <span class="material-icons-round text-[16px]">edit</span>
                                </a>
                                <button type="button"
                                        title="លុប"
                                        onclick="openDeleteModal(
                                            '{{ route('admin.students.destroy', $student) }}',
                                            'តើអ្នកពិតជាចង់លុបសិស្ស {{ addslashes($student->name_en) }} ({{ addslashes($student->student_code) }}) មែនទេ?'
                                        )"
                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                               bg-slate-100 hover:bg-red-100 border border-slate-200
                                               hover:border-red-300 text-slate-500 hover:text-red-600 transition-all">
                                    <span class="material-icons-round text-[16px]">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <x-empty-state 
                        colspan="8"
                        icon="groups"
                        title="មិនទាន់មានទិន្នន័យសិស្សទេ"
                        description="សូមចុចប៊ូតុងខាងក្រោមដើម្បីចុះឈ្មោះសិស្សថ្មី។"
                        action_url="{{ route('admin.students.create') }}"
                        action_text="ចុះឈ្មោះសិស្សថ្មី"
                    />
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- Pagination --}}
    @include('components.pagination', ['paginator' => $students, 'label' => 'នាក់'])
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('studentSearchInput');
    const form = document.getElementById('studentFilterForm');
    if (searchInput && form) {
        let timer = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                form.submit();
            }, 400);
        });
        // If search was performed, place cursor at the end
        if (searchInput.value) {
            searchInput.focus();
            const val = searchInput.value;
            searchInput.value = '';
            searchInput.value = val;
        }
    }
});
</script>

@endsection
