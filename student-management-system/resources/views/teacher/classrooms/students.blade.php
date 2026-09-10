@extends('layouts.teacher')

@section('title', 'សិស្សក្នុងថ្នាក់ ' . ($classroom->name ?? ''))
@section('page-title', 'សិស្សក្នុងថ្នាក់ ' . ($classroom->name ?? ''))

@section('breadcrumb')
    <a href="{{ route('teacher.classrooms.index') }}" class="hover:text-slate-600">ថ្នាក់របស់ខ្ញុំ</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-slate-600">{{ $classroom->name }}</span>
@endsection

@section('header-actions')
    <a href="{{ route('teacher.attendance.index', ['classroom_id' => $classroom->id, 'date' => today()->toDateString()]) }}"
       class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
        <span class="material-icons-round text-[18px]">fact_check</span>
        កត់វត្តមានថ្ងៃនេះ
    </a>
@endsection

@section('content')

{{-- Info bar --}}
<div class="bg-white border border-slate-200 rounded-2xl px-5 py-4 mb-6 flex flex-wrap gap-4 items-center shadow-sm">
    <div class="flex items-center gap-2 text-sm text-slate-600">
        <span class="material-icons-round text-slate-400 text-[18px]">layers</span>
        <span>ថ្នាក់: <strong class="text-slate-800">{{ $classroom->grade->name ?? '—' }}</strong></span>
    </div>
    <div class="flex items-center gap-2 text-sm text-slate-600">
        <span class="material-icons-round text-slate-400 text-[18px]">calendar_today</span>
        <span>ឆ្នាំសិក្សា: <strong class="text-slate-800">{{ $classroom->academicYear->name ?? '—' }}</strong></span>
    </div>
    <div class="flex items-center gap-2 text-sm text-slate-600">
        <span class="material-icons-round text-slate-400 text-[18px]">groups</span>
        <span>ចំនួនសិស្សសកម្ម: <strong class="text-slate-800">{{ $students->count() }}</strong> នាក់</span>
    </div>
</div>

{{-- Student Table --}}
@if($students->isEmpty())
    <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-4 block">person_off</span>
        <p class="text-slate-500 font-medium">មិនមានសិស្សសកម្មក្នុងថ្នាក់នេះទេ។</p>
    </div>
@else
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="font-semibold text-slate-800">បញ្ជីសិស្ស</h2>
            <span class="text-sm text-slate-400">{{ $students->count() }} នាក់</span>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-100">
                        <th class="px-5 py-3 text-left font-medium text-slate-500 w-10">#</th>
                        <th class="px-5 py-3 text-left font-medium text-slate-500">ឈ្មោះខ្មែរ</th>
                        <th class="px-5 py-3 text-left font-medium text-slate-500">ឈ្មោះឡាតាំង</th>
                        <th class="px-5 py-3 text-left font-medium text-slate-500">លេខកូដ</th>
                        <th class="px-5 py-3 text-left font-medium text-slate-500">ភេទ</th>
                        <th class="px-5 py-3 text-left font-medium text-slate-500">ទូរស័ព្ទ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($students as $i => $student)
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-5 py-3.5 text-slate-400">{{ $i + 1 }}</td>
                            <td class="px-5 py-3.5 font-medium text-slate-800">{{ $student->name_kh }}</td>
                            <td class="px-5 py-3.5 text-slate-600">{{ $student->name_en }}</td>
                            <td class="px-5 py-3.5 text-slate-500 font-mono text-xs">{{ $student->student_code }}</td>
                            <td class="px-5 py-3.5">
                                @if($student->gender === 'female')
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 text-xs font-medium">ស្រី</span>
                                @else
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">ប្រុស</span>
                                @endif
                            </td>
                            <td class="px-5 py-3.5 text-slate-500">{{ $student->phone ?? '—' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endif

@endsection
