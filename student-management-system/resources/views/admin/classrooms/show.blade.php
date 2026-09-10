@extends('layouts.admin')

@section('title', 'ថ្នាក់រៀន — ' . $classroom->name)
@section('page-title', 'ព័ត៌មានថ្នាក់រៀន')
@section('breadcrumb')
    <a href="{{ route('admin.classrooms.index') }}" class="hover:text-slate-700">ថ្នាក់រៀន</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-slate-500">{{ $classroom->name }}</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.classrooms.index') }}"
       class="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300
              hover:border-slate-400 text-slate-700 hover:text-slate-900 text-sm font-medium
              px-4 py-2 rounded-xl transition-all shadow-sm">
        <span class="material-icons-round text-[18px]">arrow_back</span>
        <span>ត្រឡប់ក្រោយ</span>
    </a>
    <a href="{{ route('admin.classrooms.edit', $classroom) }}"
       class="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300
              hover:border-slate-400 text-slate-700 hover:text-slate-900 text-sm font-medium
              px-4 py-2 rounded-xl transition-all shadow-sm">
        <span class="material-icons-round text-[18px]">edit</span>
        <span>កែប្រែ</span>
    </a>
    <a href="{{ route('admin.classrooms.assign-subjects', $classroom) }}"
       class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
              text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm">
        <span class="material-icons-round text-[18px]">assignment_ind</span>
        <span>ចាត់តាំងគ្រូមុខវិជ្ជា</span>
    </a>
@endsection

@section('content')

@php
    $studentCount = $classroom->students->count();
    $capacityPercent = $classroom->max_students > 0 ? round(($studentCount / $classroom->max_students) * 100) : 0;
    
    // Capacity color logic
    if ($capacityPercent >= 90) {
        $capColor = 'rose';
    } elseif ($capacityPercent >= 70) {
        $capColor = 'amber';
    } else {
        $capColor = 'emerald';
    }

    $ht = $classroom->homeroomTeacher?->teacherProfile;
@endphp

<div class="max-w-6xl mx-auto space-y-6">

    {{-- HERO HEADER --}}
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div class="h-2 w-full
                    @if($classroom->track === 'science') bg-gradient-to-r from-teal-400 to-emerald-400
                    @elseif($classroom->track === 'social_science') bg-gradient-to-r from-amber-400 to-orange-400
                    @else bg-gradient-to-r from-sky-400 to-blue-500 @endif">
        </div>
        
        <div class="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div class="flex items-center gap-5">
                <div class="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-4xl shadow-sm
                            @if($classroom->track === 'science') bg-teal-50 border border-teal-200 text-teal-700
                            @elseif($classroom->track === 'social_science') bg-amber-50 border border-amber-200 text-amber-700
                            @else bg-sky-50 border border-sky-200 text-sky-700 @endif">
                    {{ $classroom->grade?->level }}
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ $classroom->name }}</h1>
                    <div class="flex flex-wrap items-center gap-3 text-sm">
                        <span class="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg">
                            <span class="material-icons-round text-[16px]">calendar_today</span>
                            {{ $classroom->academicYear?->name }}
                        </span>
                        
                        @if($classroom->track === 'science')
                            <span class="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 px-3 py-1 rounded-lg font-medium">
                                <span class="material-icons-round text-[16px]">science</span> វិទ្យាសាស្ត្រ
                            </span>
                        @elseif($classroom->track === 'social_science')
                            <span class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-lg font-medium">
                                <span class="material-icons-round text-[16px]">account_balance</span> វិទ្យាសាស្ត្រសង្គម
                            </span>
                        @else
                            <span class="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 px-3 py-1 rounded-lg font-medium">
                                <span class="material-icons-round text-[16px]">menu_book</span> ទូទៅ
                            </span>
                        @endif

                        @if($classroom->room)
                            <span class="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-lg">
                                <span class="material-icons-round text-[16px]">meeting_room</span>
                                បន្ទប់ {{ $classroom->room }}
                            </span>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Capacity Widget --}}
            <div class="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div class="flex-1 min-w-[120px]">
                    <p class="text-xs text-slate-500 mb-1 font-medium">ចំនួនសិស្ស</p>
                    <p class="text-xl font-bold text-slate-800 font-mono">
                        {{ $studentCount }} <span class="text-sm text-slate-400 font-normal">/ {{ $classroom->max_students }}</span>
                    </p>
                </div>
                <div class="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <svg class="w-14 h-14 transform -rotate-90">
                        <circle cx="28" cy="28" r="24" stroke="currentColor" stroke-width="6" fill="transparent" class="text-slate-200" />
                        <circle cx="28" cy="28" r="24" stroke="currentColor" stroke-width="6" fill="transparent" 
                                stroke-dasharray="{{ 2 * pi() * 24 }}" 
                                stroke-dashoffset="{{ 2 * pi() * 24 * (1 - min($capacityPercent, 100) / 100) }}"
                                class="text-{{ $capColor }}-500 transition-all duration-1000 ease-out" />
                    </svg>
                    <span class="absolute text-[11px] font-bold text-{{ $capColor }}-600">{{ $capacityPercent }}%</span>
                </div>
            </div>
        </div>
    </div>

    {{-- MAIN CONTENT GRID --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {{-- LEFT COLUMN: Details & Homeroom --}}
        <div class="lg:col-span-1 space-y-6">
            
            {{-- Homeroom Teacher Card --}}
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/70">
                    <span class="material-icons-round text-indigo-500 text-[18px]">admin_panel_settings</span>
                    <h3 class="font-semibold text-slate-800 text-sm">គ្រូបន្ទុកថ្នាក់</h3>
                </div>
                <div class="p-5">
                    @if($ht)
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center
                                        {{ $ht->gender === 'female' ? 'bg-pink-50 border border-pink-200 text-pink-600' : 'bg-sky-50 border border-sky-200 text-sky-600' }}">
                                <span class="material-icons-round text-[24px]">
                                    {{ $ht->gender === 'female' ? 'face_3' : 'face' }}
                                </span>
                            </div>
                            <div>
                                <p class="text-base font-bold text-slate-800">{{ $ht->name_kh }}</p>
                                <p class="text-xs text-slate-500">{{ $ht->name_en }}</p>
                                <p class="text-xs text-slate-400 font-mono mt-1">{{ $ht->phone ?? 'គ្មានលេខទូរស័ព្ទ' }}</p>
                            </div>
                        </div>
                    @else
                        <div class="text-center py-6">
                            <div class="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span class="material-icons-round text-slate-400 text-[24px]">person_off</span>
                            </div>
                            <p class="text-sm text-slate-500">មិនទាន់មានគ្រូបន្ទុកថ្នាក់</p>
                            <a href="{{ route('admin.classrooms.edit', $classroom) }}" class="text-indigo-600 hover:text-indigo-700 font-medium text-xs mt-2 inline-block">
                                កំណត់ឥឡូវនេះ &rarr;
                            </a>
                        </div>
                    @endif
                </div>
            </div>

            {{-- Assigned Subjects Card --}}
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div class="flex items-center gap-2">
                        <span class="material-icons-round text-indigo-500 text-[18px]">local_library</span>
                        <h3 class="font-semibold text-slate-800 text-sm">មុខវិជ្ជា & គ្រូបង្រៀន</h3>
                    </div>
                    <span class="bg-white text-slate-600 text-xs px-2 py-0.5 rounded-md font-medium border border-slate-200 shadow-sm">
                        {{ $classroom->teacherClassSubjects->count() }} មុខ
                    </span>
                </div>
                <div class="p-0">
                    @if($classroom->teacherClassSubjects->isEmpty())
                        <div class="text-center py-8 px-4">
                            <p class="text-sm text-slate-500 mb-3">មិនទាន់បានចាត់តាំងគ្រូមុខវិជ្ជាទេ</p>
                            <a href="{{ route('admin.classrooms.assign-subjects', $classroom) }}" 
                               class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 transition-colors shadow-sm">
                                <span class="material-icons-round text-[14px]">add</span> ចាត់តាំងឥឡូវនេះ
                            </a>
                        </div>
                    @else
                        <ul class="divide-y divide-slate-100">
                            @foreach($classroom->teacherClassSubjects as $tcs)
                                <li class="px-5 py-3 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3">
                                    <div class="min-w-0">
                                        <p class="text-sm font-medium text-slate-800 truncate">{{ $tcs->subject?->name_kh }}</p>
                                        <p class="text-[11px] text-slate-400 font-mono">{{ $tcs->subject?->code }}</p>
                                    </div>
                                    <div class="text-right min-w-0">
                                        <p class="text-sm text-slate-600 truncate">{{ $tcs->teacherProfile?->name_kh }}</p>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
                        <div class="px-5 py-3 border-t border-slate-100 bg-slate-50/30 text-center">
                            <a href="{{ route('admin.classrooms.assign-subjects', $classroom) }}" class="text-indigo-600 hover:text-indigo-700 text-xs font-medium inline-flex items-center gap-1">
                                <span class="material-icons-round text-[14px]">edit</span> កែប្រែការចាត់តាំង
                            </a>
                        </div>
                    @endif
                </div>
            </div>

        </div>

        {{-- RIGHT COLUMN: Students List --}}
        <div class="lg:col-span-2">
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div class="flex items-center gap-2">
                        <span class="material-icons-round text-indigo-500 text-[18px]">groups</span>
                        <h3 class="font-semibold text-slate-800 text-sm">បញ្ជីសិស្សក្នុងថ្នាក់</h3>
                    </div>
                    <a href="{{ route('admin.students.create') }}" class="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 transition-colors">
                        <span class="material-icons-round text-[14px]">add</span> ចុះឈ្មោះសិស្ស
                    </a>
                </div>

                <div class="p-0 overflow-x-auto flex-1">
                    @if($classroom->students->isEmpty())
                        <div class="flex flex-col items-center justify-center py-20 px-4 text-center h-full">
                            <div class="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-4">
                                <span class="material-icons-round text-slate-400 text-3xl">groups</span>
                            </div>
                            <p class="text-slate-700 font-medium mb-1">ថ្នាក់រៀននេះមិនទាន់មានសិស្សទេ</p>
                            <p class="text-sm text-slate-500 max-w-sm">
                                អ្នកអាចបន្ថែមសិស្សទៅកាន់ថ្នាក់នេះតាមរយៈការ <a href="{{ route('admin.students.create') }}" class="text-indigo-600 hover:underline">ចុះឈ្មោះសិស្សថ្មី</a>។
                            </p>
                        </div>
                    @else
                        <table class="w-full text-sm">
                            <thead class="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th class="px-5 py-3 text-left font-semibold w-16">ល.រ</th>
                                    <th class="px-5 py-3 text-left font-semibold">អត្តលេខ</th>
                                    <th class="px-5 py-3 text-left font-semibold">ឈ្មោះសិស្ស</th>
                                    <th class="px-5 py-3 text-center font-semibold">ភេទ</th>
                                    <th class="px-5 py-3 text-center font-semibold">ស្ថានភាព</th>
                                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @foreach($classroom->students as $index => $student)
                                    <tr class="hover:bg-slate-50/70 transition-colors group">
                                        <td class="px-5 py-3 text-slate-500">{{ $index + 1 }}</td>
                                        <td class="px-5 py-3">
                                            <span class="font-mono text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                {{ $student->student_code }}
                                            </span>
                                        </td>
                                        <td class="px-5 py-3">
                                            <p class="font-medium text-slate-800">{{ $student->name_kh }}</p>
                                            <p class="text-[11px] text-slate-500">{{ $student->name_en }}</p>
                                        </td>
                                        <td class="px-5 py-3 text-center">
                                            @if($student->gender === 'female')
                                                <span class="text-pink-600 text-xs font-medium bg-pink-50 px-2 py-0.5 rounded border border-pink-200">ស្រី</span>
                                            @else
                                                <span class="text-sky-600 text-xs font-medium bg-sky-50 px-2 py-0.5 rounded border border-sky-200">ប្រុស</span>
                                            @endif
                                        </td>
                                        <td class="px-5 py-3 text-center">
                                            @if($student->pivot->status === 'active')
                                                <span class="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> សកម្ម
                                                </span>
                                            @elseif($student->pivot->status === 'transferred')
                                                <span class="text-sky-600 text-xs font-medium">ផ្ទេរចេញ</span>
                                            @elseif($student->pivot->status === 'dropped')
                                                <span class="text-slate-500 text-xs font-medium">បោះបង់</span>
                                            @else
                                                <span class="text-indigo-600 text-xs font-medium">បញ្ចប់</span>
                                            @endif
                                        </td>
                                        <td class="px-5 py-3 text-right">
                                            <a href="{{ route('admin.students.show', $student) }}" 
                                               class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-colors opacity-0 group-hover:opacity-100">
                                                <span class="material-icons-round text-[16px]">visibility</span>
                                            </a>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endif
                </div>
            </div>
        </div>

    </div>
</div>

@endsection
