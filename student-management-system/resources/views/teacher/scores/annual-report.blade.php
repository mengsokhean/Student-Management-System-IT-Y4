@extends('layouts.teacher')

@section('title', 'របាយការណ៍ពិន្ទុប្រចាំឆ្នាំ')
@section('page-title', 'របាយការណ៍ពិន្ទុប្រចាំឆ្នាំ')

@section('breadcrumb')
    <span class="text-slate-600">របាយការណ៍ពិន្ទុ</span>
@endsection

@section('content')

{{-- ── Filter Form ── --}}
<form method="GET" action="{{ route('teacher.scores.annual-report') }}" id="report-filter-form">
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 mb-6">
        <h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span class="material-icons-round text-emerald-600 text-[20px]">filter_list</span>
            ជ្រើសរើសថ្នាក់ និងសិស្ស
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label for="classroom_id" class="block text-xs font-medium text-slate-500 mb-1">ថ្នាក់រៀន</label>
                <select name="classroom_id" id="classroom_id"
                        onchange="document.getElementById('report-filter-form').submit()"
                        class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                    <option value="">— ជ្រើស​ថ្នាក់ —</option>
                    @foreach($classrooms as $cr)
                        <option value="{{ $cr->id }}" {{ request('classroom_id') == $cr->id ? 'selected' : '' }}>
                            {{ $cr->name }} ({{ $cr->grade->name ?? '' }} · {{ $cr->academicYear->name ?? '' }})
                        </option>
                    @endforeach
                </select>
            </div>
            @if($classroom && $students->isNotEmpty())
                <div>
                    <label for="student_id" class="block text-xs font-medium text-slate-500 mb-1">សិស្ស</label>
                    <select name="student_id" id="student_id"
                            onchange="document.getElementById('report-filter-form').submit()"
                            class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                        <option value="">— ជ្រើសសិស្ស —</option>
                        @foreach($students as $st)
                            <option value="{{ $st->id }}" {{ request('student_id') == $st->id ? 'selected' : '' }}>
                                {{ $st->name_kh }} ({{ $st->name_en }})
                            </option>
                        @endforeach
                    </select>
                </div>
            @endif
        </div>
    </div>
</form>

{{-- ── Annual Score Report ── --}}
@if($student && $scoreMatrix->isNotEmpty())

    {{-- Student Card --}}
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 mb-6 flex items-center gap-4">
        <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="material-icons-round text-emerald-600 text-2xl">person</span>
        </div>
        <div>
            <p class="font-semibold text-slate-800 text-base">{{ $student->name_kh }}</p>
            <p class="text-sm text-slate-400">{{ $student->name_en }} &middot; {{ $student->student_code }}</p>
        </div>
        <div class="ml-auto text-right">
            <p class="text-xs text-slate-400">ថ្នាក់</p>
            <p class="font-semibold text-slate-700">{{ $classroom->name }}</p>
        </div>
    </div>

    {{-- Score tables per semester --}}
    @foreach($scoreMatrix as $sem => $subjectScores)
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-5">
            <div class="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <span class="material-icons-round text-emerald-600 text-[20px]">calendar_view_month</span>
                <h3 class="font-semibold text-slate-800">ឆមាសទី {{ $sem }}</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-slate-100">
                            <th class="px-5 py-3 text-left font-medium text-slate-500">មុខវិជ្ជា</th>
                            <th class="px-5 py-3 text-center font-medium text-slate-600">ខែ ១</th>
                            <th class="px-5 py-3 text-center font-medium text-slate-600">ខែ ២</th>
                            <th class="px-5 py-3 text-center font-medium text-slate-600">ខែ ៣</th>
                            <th class="px-5 py-3 text-center font-medium text-slate-600">ខែ ៤</th>
                            <th class="px-5 py-3 text-center font-medium text-indigo-600">ប្រឡង</th>
                            <th class="px-5 py-3 text-center font-medium text-emerald-700">មធ្យម</th>
                            <th class="px-5 py-3 text-center font-medium text-slate-500">លទ្ធផល</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach($subjectScores as $subjectId => $score)
                            @php
                                $hasAll = !is_null($score->month1) && !is_null($score->month2)
                                       && !is_null($score->month3) && !is_null($score->month4)
                                       && !is_null($score->exam_score);
                                $avg = $hasAll
                                    ? round((($score->month1 + $score->month2 + $score->month3 + $score->month4)
                                             + ($score->exam_score * 2)) / 6, 2)
                                    : null;
                                $pass = $avg !== null && $avg >= 50;
                            @endphp
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-5 py-3.5">
                                    <p class="font-medium text-slate-800">{{ $score->subject->name_kh ?? '—' }}</p>
                                    <p class="text-xs text-slate-400">{{ $score->subject->name_en ?? '' }}</p>
                                </td>
                                @foreach(['month1','month2','month3','month4'] as $field)
                                    <td class="px-5 py-3.5 text-center text-slate-600">
                                        {{ is_null($score->{$field}) ? '—' : number_format($score->{$field}, 2) }}
                                    </td>
                                @endforeach
                                <td class="px-5 py-3.5 text-center font-semibold text-indigo-600">
                                    {{ is_null($score->exam_score) ? '—' : number_format($score->exam_score, 2) }}
                                </td>
                                <td class="px-5 py-3.5 text-center font-bold {{ $avg !== null ? ($pass ? 'text-emerald-600' : 'text-red-500') : 'text-slate-400' }}">
                                    {{ $avg !== null ? $avg : '—' }}
                                </td>
                                <td class="px-5 py-3.5 text-center">
                                    @if($avg !== null)
                                        @if($pass)
                                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                                <span class="material-icons-round text-[13px]">check_circle</span> បាន
                                            </span>
                                        @else
                                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-medium">
                                                <span class="material-icons-round text-[13px]">cancel</span> មិនបាន
                                            </span>
                                        @endif
                                    @else
                                        <span class="text-slate-300 text-xs">—</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    @endforeach

@elseif($student && $scoreMatrix->isEmpty())
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">grade</span>
        <p class="text-slate-500">មិនមានពិន្ទុត្រូវបានបញ្ចូលសម្រាប់សិស្សនេះទេ។</p>
    </div>

@elseif($classroom && !$student)
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">person_search</span>
        <p class="text-slate-500">សូមជ្រើសសិស្ស ដើម្បីមើលរបាយការណ៍ពិន្ទុ។</p>
    </div>

@else
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">summarize</span>
        <p class="text-slate-500 font-medium">សូមជ្រើសថ្នាក់ និងសិស្ស ដើម្បីមើលរបាយការណ៍ពិន្ទុប្រចាំឆ្នាំ។</p>
    </div>
@endif

@endsection
