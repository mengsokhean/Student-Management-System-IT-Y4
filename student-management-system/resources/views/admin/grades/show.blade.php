@extends('layouts.admin')

@section('title', 'ព័ត៌មានកម្រិតថ្នាក់ទី ' . $grade->level)
@section('page-title', 'ព័ត៌មានកម្រិតថ្នាក់')
@section('breadcrumb')
    <a href="{{ route('admin.grades.index') }}" class="hover:text-gray-300">កម្រិតថ្នាក់</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">ទី {{ $grade->level }}</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.grades.index') }}"
       class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700
              hover:border-gray-600 text-gray-300 hover:text-white text-sm font-medium
              px-4 py-2 rounded-xl transition-all">
        <span class="material-icons-round text-[18px]">arrow_back</span>
        <span>ត្រឡប់ក្រោយ</span>
    </a>
    <a href="{{ route('admin.grades.edit', $grade) }}"
       class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800
              text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-brand-600/20">
        <span class="material-icons-round text-[18px]">edit</span>
        <span>កែប្រែ</span>
    </a>
@endsection

@section('content')

<div class="max-w-4xl mx-auto space-y-6">

    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-5">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl
                    bg-brand-950/70 border-2 border-brand-700/50 text-brand-400">
            {{ $grade->level }}
        </div>
        <div>
            <h1 class="text-2xl font-bold text-white mb-1">{{ $grade->name }}</h1>
            <p class="text-gray-400 text-sm">ព័ត៌មានលម្អិតនៃកម្រិតថ្នាក់នេះ</p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {{-- Classrooms List --}}
        <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-800 flex items-center gap-2 bg-gray-800/30">
                <span class="material-icons-round text-brand-400 text-[18px]">meeting_room</span>
                <h3 class="font-semibold text-white text-sm">ថ្នាក់រៀនសរុប ({{ $grade->classrooms->count() }})</h3>
            </div>
            <div class="p-0">
                @if($grade->classrooms->isEmpty())
                    <div class="text-center py-8">
                        <p class="text-sm text-gray-500">មិនទាន់មានថ្នាក់រៀនទេ</p>
                    </div>
                @else
                    <ul class="divide-y divide-gray-800/50">
                        @foreach($grade->classrooms as $room)
                            <li class="px-5 py-3 hover:bg-gray-800/20 transition-colors flex items-center justify-between">
                                <span class="text-sm font-medium text-white">{{ $room->name }}</span>
                                <a href="{{ route('admin.classrooms.show', $room) }}" class="text-brand-400 hover:text-brand-300 text-xs">មើលលម្អិត &rarr;</a>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>

        {{-- Subjects List --}}
        <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-800/30">
                <div class="flex items-center gap-2">
                    <span class="material-icons-round text-emerald-400 text-[18px]">menu_book</span>
                    <h3 class="font-semibold text-white text-sm">មុខវិជ្ជាសរុប ({{ $grade->subjects->count() }})</h3>
                </div>
            </div>
            <div class="p-0">
                @if($grade->subjects->isEmpty())
                    <div class="text-center py-8">
                        <p class="text-sm text-gray-500">មិនទាន់មានមុខវិជ្ជាទេ</p>
                    </div>
                @else
                    <ul class="divide-y divide-gray-800/50">
                        @foreach($grade->subjects as $sub)
                            <li class="px-5 py-3 hover:bg-gray-800/20 transition-colors flex flex-col justify-center">
                                <span class="text-sm font-medium text-white">{{ $sub->name_kh }}</span>
                                <div class="flex items-center gap-2 mt-1 text-xs">
                                    <span class="text-gray-500 font-mono">{{ $sub->code }}</span>
                                    <span class="text-gray-600">&bull;</span>
                                    @if($sub->pivot->track === 'science')
                                        <span class="text-teal-400">វិទ្យាសាស្ត្រ</span>
                                    @elseif($sub->pivot->track === 'social_science')
                                        <span class="text-amber-400">វិទ្យាសាស្ត្រសង្គម</span>
                                    @else
                                        <span class="text-sky-400">ទូទៅ</span>
                                    @endif
                                </div>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>

    </div>

</div>

@endsection
