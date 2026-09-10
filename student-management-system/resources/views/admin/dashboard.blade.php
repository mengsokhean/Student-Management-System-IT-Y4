@extends('layouts.admin')

@section('title', 'ផ្ដាំងព័ត៌មានសង្ខេប')
@section('page-title', 'ផ្ដាំងព័ត៌មានសង្ខេប')

@section('content')

{{-- ── Welcome Banner ── --}}
<div class="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900
            rounded-[2rem] overflow-hidden mb-8 px-8 py-8 shadow-xl shadow-indigo-200/50">

    {{-- Background decorations --}}
    <div class="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute right-32 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
    <div class="absolute left-1/4 top-0 w-32 h-32 bg-white/5 rounded-full blur-lg pointer-events-none"></div>

    <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center
                        justify-center flex-shrink-0 border border-white/30 shadow-inner">
                <span class="material-icons-round text-white text-[32px]">waving_hand</span>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-white leading-tight">
                    អ្នកគ្រប់គ្រងប្រព័ន្ធ
                </h1>
            </div>
        </div>

        {{-- Date chip --}}
        <div class="flex-shrink-0 bg-white/10 border border-white/20 rounded-2xl px-5 py-3
                    flex items-center gap-3 text-sm text-white/90 backdrop-blur-md shadow-sm hover:bg-white/20 transition-colors cursor-default">
            <span class="material-icons-round text-[20px] text-indigo-300">calendar_today</span>
            <p class="font-semibold tracking-wide">{{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
        </div>
    </div>
</div>

{{-- ── Stats Grid ── --}}
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

    @php
    $stats = [
        [
            'label'   => 'សិស្សសរុប',
            'value'   => $studentCount,
            'icon'    => 'groups',
            'bg'      => 'bg-blue-50',
            'border'  => 'border-blue-100',
            'iconClr' => 'text-blue-600',
            'valClr'  => 'text-blue-900',
            'route'   => 'admin.students.index',
        ],
        [
            'label'   => 'គ្រូបង្រៀន',
            'value'   => $teacherCount,
            'icon'    => 'person',
            'bg'      => 'bg-emerald-50',
            'border'  => 'border-emerald-100',
            'iconClr' => 'text-emerald-600',
            'valClr'  => 'text-emerald-900',
            'route'   => 'admin.teachers.index',
        ],
        [
            'label'   => 'ថ្នាក់រៀន',
            'value'   => $classroomCount,
            'icon'    => 'meeting_room',
            'bg'      => 'bg-amber-50',
            'border'  => 'border-amber-100',
            'iconClr' => 'text-amber-600',
            'valClr'  => 'text-amber-900',
            'route'   => 'admin.classrooms.index',
        ],
        [
            'label'   => 'មុខវិជ្ជា',
            'value'   => $subjectCount,
            'icon'    => 'menu_book',
            'bg'      => 'bg-violet-50',
            'border'  => 'border-violet-100',
            'iconClr' => 'text-violet-600',
            'valClr'  => 'text-violet-900',
            'route'   => 'admin.subjects.index',
        ],
    ];
    @endphp

    @foreach($stats as $stat)
        <a href="{{ route($stat['route']) }}"
           class="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm p-6
                  hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-300 hover:-translate-y-1
                  transition-all duration-300 group relative overflow-hidden flex flex-col">
            
            <div class="absolute -right-4 -top-4 w-24 h-24 {{ $stat['bg'] }} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

            <div class="flex items-start justify-between mb-6 relative z-10">
                {{-- Icon --}}
                <div class="w-14 h-14 {{ $stat['bg'] }} border {{ $stat['border'] }}
                            rounded-2xl flex items-center justify-center flex-shrink-0
                            group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                    <span class="material-icons-round {{ $stat['iconClr'] }} text-[26px]">
                        {{ $stat['icon'] }}
                    </span>
                </div>
                {{-- Arrow link --}}
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <span class="material-icons-round group-hover:translate-x-0.5 transition-transform text-[20px]">
                        arrow_forward
                    </span>
                </div>
            </div>

            <div class="relative z-10 mt-auto">
                <p class="text-4xl font-black {{ $stat['valClr'] }} tracking-tight leading-none mb-2">
                    {{ number_format($stat['value']) }}
                </p>
                <p class="text-base font-bold text-slate-700">{{ $stat['label'] }}</p>
            </div>
        </a>
    @endforeach
</div>

{{-- ── Bottom Split Layout ── --}}
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {{-- ── LEFT: Recent Classrooms (col-span-2) ── --}}
    <div class="lg:col-span-2 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm flex flex-col overflow-hidden">

        {{-- Panel header --}}
        <div class="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-slate-50/50">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white border border-slate-200 shadow-sm rounded-xl
                            flex items-center justify-center">
                    <span class="material-icons-round text-indigo-600 text-[20px]">meeting_room</span>
                </div>
                <div>
                    <h2 class="text-base font-bold text-slate-800 leading-tight">បញ្ជីថ្នាក់រៀនថ្មីៗ</h2>
                </div>
            </div>
            <a href="{{ route('admin.classrooms.index') }}"
               class="text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors">
                មើលទាំងអស់
                <span class="material-icons-round text-[16px]">arrow_forward</span>
            </a>
        </div>

        {{-- Table --}}
        <div class="overflow-x-auto flex-1">
            @if($recentClassrooms->isEmpty())
                <div class="flex flex-col items-center justify-center h-full min-h-[300px] gap-4">
                    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                        <span class="material-icons-round text-slate-300 text-4xl">meeting_room</span>
                    </div>
                    <div class="text-center">
                        <p class="text-slate-600 font-semibold text-lg">មិនទាន់មានថ្នាក់រៀន</p>
                        <p class="text-slate-400 text-sm mt-1">សូមបង្កើតថ្នាក់រៀនថ្មី ដើម្បីចាប់ផ្តើមប្រើប្រាស់។</p>
                    </div>
                    <a href="{{ route('admin.classrooms.create') }}"
                       class="mt-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all">
                        + បង្កើតថ្នាក់រៀនថ្មី
                    </a>
                </div>
            @else
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-white border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                            <th class="px-7 py-4 text-left font-bold">ឈ្មោះថ្នាក់</th>
                            <th class="px-7 py-4 text-left font-bold">កម្រិត</th>
                            <th class="px-7 py-4 text-left font-bold">ផ្នែក</th>
                            <th class="px-7 py-4 text-left font-bold">ឆ្នាំសិក្សា</th>
                            <th class="px-7 py-4 text-right font-bold">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        @foreach($recentClassrooms as $classroom)
                            <tr class="hover:bg-slate-50/80 transition-colors group">

                                {{-- Name --}}
                                <td class="px-7 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-xl flex items-center justify-center
                                                    flex-shrink-0 font-bold text-sm shadow-sm
                                                    @if($classroom->track === 'science')
                                                        bg-teal-50 border border-teal-100 text-teal-700
                                                    @elseif($classroom->track === 'social_science')
                                                        bg-amber-50 border border-amber-100 text-amber-700
                                                    @else
                                                        bg-sky-50 border border-sky-100 text-sky-700
                                                    @endif">
                                            {{ $classroom->grade?->level ?? '?' }}
                                        </div>
                                        <span class="font-bold text-slate-800 text-base">{{ $classroom->name }}</span>
                                    </div>
                                </td>

                                {{-- Grade --}}
                                <td class="px-7 py-4">
                                    <span class="inline-flex items-center justify-center px-3 h-8 rounded-lg
                                                 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                                        ថ្នាក់ទី {{ $classroom->grade?->level ?? '—' }}
                                    </span>
                                </td>

                                {{-- Track --}}
                                <td class="px-7 py-4">
                                    @if($classroom->track === 'science')
                                        <span class="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200
                                                     text-teal-700 text-xs px-3 py-1.5 rounded-full font-bold">
                                            <span class="material-icons-round text-[14px]">science</span>
                                            វិទ្យាសាស្ត្រ
                                        </span>
                                    @elseif($classroom->track === 'social_science')
                                        <span class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200
                                                     text-amber-700 text-xs px-3 py-1.5 rounded-full font-bold">
                                            <span class="material-icons-round text-[14px]">account_balance</span>
                                            សង្គម
                                        </span>
                                    @else
                                        <span class="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200
                                                     text-sky-700 text-xs px-3 py-1.5 rounded-full font-bold">
                                            <span class="material-icons-round text-[14px]">menu_book</span>
                                            ទូទៅ
                                        </span>
                                    @endif
                                </td>

                                {{-- Academic Year --}}
                                <td class="px-7 py-4">
                                    <div class="flex items-center gap-2">
                                        <span class="text-slate-600 font-medium">{{ $classroom->academicYear?->name ?? '—' }}</span>
                                        @if($classroom->academicYear?->is_active)
                                            <span class="inline-flex items-center gap-1 text-emerald-700
                                                         bg-emerald-100 border border-emerald-200 text-[10px]
                                                         px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                Active
                                            </span>
                                        @endif
                                    </div>
                                </td>

                                {{-- Action --}}
                                <td class="px-7 py-4 text-right">
                                    <a href="{{ route('admin.classrooms.show', $classroom) }}"
                                       class="inline-flex items-center justify-center w-9 h-9 rounded-xl
                                              bg-white hover:bg-indigo-50 border border-slate-200
                                              hover:border-indigo-200 text-slate-400 hover:text-indigo-600
                                              shadow-sm transition-all duration-200 group-hover:border-indigo-300 group-hover:text-indigo-600">
                                        <span class="material-icons-round text-[18px]">visibility</span>
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>

    {{-- ── RIGHT: Quick Actions (col-span-1) ── --}}
    <div class="lg:col-span-1 flex flex-col gap-6">
        <div class="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm flex-1 flex flex-col overflow-hidden">
            {{-- Panel header --}}
            <div class="flex items-center gap-3 px-7 py-5 border-b border-slate-100 bg-slate-50/50">
                <div class="w-10 h-10 bg-white border border-slate-200 shadow-sm rounded-xl
                            flex items-center justify-center">
                    <span class="material-icons-round text-indigo-600 text-[20px]">bolt</span>
                </div>
                <div>
                    <h2 class="text-base font-bold text-slate-800 leading-tight">ម៉ឺនុយរហ័ស</h2>
                </div>
            </div>

            {{-- Action Buttons --}}
            <div class="p-5 flex flex-col gap-3 flex-1 justify-center">
                @foreach([
                    ['label' => 'ឆ្នាំសិក្សា',          'route' => 'admin.academic-years.index', 'icon' => 'calendar_month',  'color' => 'text-indigo-600',  'bg' => 'bg-indigo-50',  'border' => 'border-indigo-100'],
                    ['label' => 'កម្រិតថ្នាក់',          'route' => 'admin.grades.index',         'icon' => 'layers',          'color' => 'text-violet-600',  'bg' => 'bg-violet-50',  'border' => 'border-violet-100'],
                    ['label' => 'មុខវិជ្ជា',             'route' => 'admin.subjects.index',       'icon' => 'menu_book',       'color' => 'text-sky-600',     'bg' => 'bg-sky-50',     'border' => 'border-sky-100'],
                    ['label' => 'ថ្នាក់រៀន',             'route' => 'admin.classrooms.index',     'icon' => 'meeting_room',    'color' => 'text-amber-600',   'bg' => 'bg-amber-50',   'border' => 'border-amber-100'],
                    ['label' => 'គ្រូបង្រៀន',            'route' => 'admin.teachers.index',       'icon' => 'badge',           'color' => 'text-emerald-600', 'bg' => 'bg-emerald-50', 'border' => 'border-emerald-100'],
                    ['label' => 'ការចុះឈ្មោះចូលរៀន',  'route' => 'admin.enrollment.index',     'icon' => 'how_to_reg',      'color' => 'text-rose-600',    'bg' => 'bg-rose-50',    'border' => 'border-rose-100'],
                ] as $action)
                    <a href="{{ route($action['route']) }}"
                       class="flex items-center gap-4 px-5 py-3.5 rounded-[1rem] bg-white border border-slate-100 shadow-sm
                              hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5
                              transition-all duration-300 group">
                        <div class="w-10 h-10 {{ $action['bg'] }} border {{ $action['border'] }} rounded-xl
                                    flex items-center justify-center flex-shrink-0
                                    group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <span class="material-icons-round {{ $action['color'] }} text-[20px]">
                                {{ $action['icon'] }}
                            </span>
                        </div>
                        <span class="text-[15px] font-bold text-slate-700 group-hover:text-indigo-700
                                     transition-colors flex-1">
                            {{ $action['label'] }}
                        </span>
                        <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <span class="material-icons-round text-slate-400 group-hover:text-indigo-600
                                         group-hover:translate-x-0.5 transition-all text-[18px]">
                                chevron_right
                            </span>
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    </div>

</div>

@endsection
