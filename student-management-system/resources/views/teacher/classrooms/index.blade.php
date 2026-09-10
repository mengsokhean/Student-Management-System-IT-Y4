@extends('layouts.teacher')

@section('title', 'ថ្នាក់របស់ខ្ញុំ')
@section('page-title', 'ថ្នាក់របស់ខ្ញុំ')

@section('content')

{{-- ── Page Header ── --}}
<div class="mb-6">
    <p class="text-slate-500 text-sm mt-1">ថ្នាក់រៀនដែលអ្នកត្រូវបានចាត់តាំង (អាណាព្យាបាល ឬ បង្រៀនមុខវិជ្ជា)</p>
</div>

@if($classrooms->isEmpty())
    <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-4 block">meeting_room</span>
        <p class="text-slate-500 font-medium">អ្នកមិនទាន់ត្រូវបានចាត់តាំងទៅថ្នាក់ណាមួយទេ។</p>
        <p class="text-slate-400 text-sm mt-1">សូមទាក់ទងអ្នកគ្រប់គ្រងដើម្បីចាត់តាំង។</p>
    </div>
@else
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        @foreach($classrooms as $classroom)
            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {{-- Card Header --}}
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-semibold text-slate-800 text-base">{{ $classroom->name }}</h3>
                        <p class="text-xs text-slate-400 mt-0.5">
                            {{ $classroom->grade->name ?? '—' }}
                            @if($classroom->track)
                                &middot; {{ $classroom->track }}
                            @endif
                        </p>
                    </div>
                    @if($classroom->is_homeroom)
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                            <span class="material-icons-round text-[14px]">star</span>
                            អាណាព្យាបាល
                        </span>
                    @else
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-medium">
                            <span class="material-icons-round text-[14px]">menu_book</span>
                            មុខវិជ្ជា
                        </span>
                    @endif
                </div>

                {{-- Card Body --}}
                <div class="px-5 py-4 space-y-2">
                    <div class="flex items-center gap-2 text-sm text-slate-600">
                        <span class="material-icons-round text-slate-400 text-[18px]">calendar_today</span>
                        <span>ឆ្នាំសិក្សា: {{ $classroom->academicYear->name ?? '—' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-slate-600">
                        <span class="material-icons-round text-slate-400 text-[18px]">groups</span>
                        <span>សិស្ស: <strong>{{ $classroom->student_count }}</strong> នាក់</span>
                    </div>
                    @if($classroom->room)
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <span class="material-icons-round text-slate-400 text-[18px]">place</span>
                            <span>បន្ទប់: {{ $classroom->room }}</span>
                        </div>
                    @endif
                </div>

                {{-- Card Footer --}}
                <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <a href="{{ route('teacher.classrooms.students', $classroom->id) }}"
                       class="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700
                              text-white text-sm font-medium py-2 rounded-lg transition-colors">
                        <span class="material-icons-round text-[16px]">groups</span>
                        មើលសិស្ស
                    </a>
                    <a href="{{ route('teacher.attendance.index', ['classroom_id' => $classroom->id, 'date' => today()->toDateString()]) }}"
                       class="flex-1 flex items-center justify-center gap-1.5 bg-sky-50 hover:bg-sky-100
                              text-sky-700 text-sm font-medium py-2 rounded-lg transition-colors border border-sky-200">
                        <span class="material-icons-round text-[16px]">fact_check</span>
                        វត្តមាន
                    </a>
                </div>
            </div>
        @endforeach
    </div>
@endif

@endsection
