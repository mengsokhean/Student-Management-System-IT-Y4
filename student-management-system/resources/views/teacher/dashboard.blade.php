@extends('layouts.teacher')

@section('title', 'ផ្ទាំងព័ត៌មានសង្ខេប — គ្រូ')
@section('page-title', 'ផ្ទាំងព័ត៌មានសង្ខេប')

@section('content')

{{-- Welcome Banner --}}
<div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
    <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span class="material-icons-round text-white text-3xl">school</span>
        </div>
        <div>
            <p class="text-emerald-100 text-sm mb-0.5">សូមស្វាគមន៍មកកាន់</p>
            <h2 class="text-2xl font-bold">{{ $teacher->name ?? 'គ្រូបង្រៀន' }}</h2>
            <p class="text-emerald-100 text-sm mt-0.5">{{ now()->translatedFormat('l, d F Y') }}</p>
        </div>
    </div>
</div>

{{-- Stats Cards --}}
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <a href="{{ route('teacher.classrooms.index') }}"
       class="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <span class="material-icons-round text-emerald-600 text-[20px]">meeting_room</span>
            </div>
            <p class="text-xs font-medium text-slate-500">ថ្នាក់របស់ខ្ញុំ</p>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ $stats['classrooms'] ?? 0 }}</p>
        <p class="text-xs text-slate-400 mt-0.5">ថ្នាក់ត្រូវបានចាត់តាំង</p>
    </a>

    <a href="{{ route('teacher.attendance.index') }}"
       class="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                <span class="material-icons-round text-sky-600 text-[20px]">fact_check</span>
            </div>
            <p class="text-xs font-medium text-slate-500">វត្តមានថ្ងៃនេះ</p>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ $stats['today_attendance'] ?? 0 }}</p>
        <p class="text-xs text-slate-400 mt-0.5">បានកត់ត្រា</p>
    </a>

    <a href="{{ route('teacher.scores.index') }}"
       class="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <span class="material-icons-round text-amber-600 text-[20px]">grade</span>
            </div>
            <p class="text-xs font-medium text-slate-500">ពិន្ទុបានបញ្ចូល</p>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ $stats['scores_entered'] ?? 0 }}</p>
        <p class="text-xs text-slate-400 mt-0.5">កំណត់ត្រាពិន្ទុ</p>
    </a>

    <div class="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                <span class="material-icons-round text-violet-600 text-[20px]">groups</span>
            </div>
            <p class="text-xs font-medium text-slate-500">សិស្សសរុប</p>
        </div>
        <p class="text-2xl font-bold text-slate-800">{{ $stats['total_students'] ?? 0 }}</p>
        <p class="text-xs text-slate-400 mt-0.5">នៅក្រោមការថែទាំ</p>
    </div>
</div>

{{-- Quick Navigation --}}
<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
    <div class="px-5 py-4 border-b border-slate-100">
        <h2 class="font-semibold text-slate-800">នាវាចរណ៍រហ័ស</h2>
    </div>
    <div class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        @foreach([
            ['label' => 'ថ្នាក់របស់ខ្ញុំ',       'route' => 'teacher.classrooms.index',          'icon' => 'meeting_room',   'color' => 'emerald'],
            ['label' => 'កត់វត្តមាន',             'route' => 'teacher.attendance.index',           'icon' => 'fact_check',     'color' => 'sky'],
            ['label' => 'បញ្ចូលពិន្ទុ',           'route' => 'teacher.scores.index',              'icon' => 'grade',          'color' => 'amber'],
            ['label' => 'របាយការណ៍វត្តមាន',       'route' => 'teacher.attendance.student-report', 'icon' => 'person_search',  'color' => 'teal'],
            ['label' => 'របាយការណ៍ពិន្ទុប្រចាំឆ្នាំ','route' => 'teacher.scores.annual-report',   'icon' => 'summarize',      'color' => 'indigo'],
        ] as $link)
            <a href="{{ route($link['route']) }}"
               class="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200
                      hover:border-{{ $link['color'] }}-300 hover:bg-{{ $link['color'] }}-50
                      transition-all group">
                <span class="material-icons-round text-slate-400 group-hover:text-{{ $link['color'] }}-600 text-[20px] transition-colors">
                    {{ $link['icon'] }}
                </span>
                <span class="text-sm font-medium text-slate-700 group-hover:text-{{ $link['color'] }}-700 transition-colors">
                    {{ $link['label'] }}
                </span>
            </a>
        @endforeach
    </div>
</div>

@endsection
