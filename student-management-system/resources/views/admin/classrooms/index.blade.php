@extends('layouts.admin')

@section('title', 'ថ្នាក់រៀន')
@section('page-title', 'ថ្នាក់រៀន')
@section('breadcrumb')
    <span class="text-slate-500">ថ្នាក់រៀន</span>
@endsection

@section('header-actions')
    <div class="flex items-center gap-2">
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_download</span>
            Import
        </button>
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_upload</span>
            Export
        </button>
        <a href="{{ route('admin.classrooms.create') }}" class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30">
            <span class="material-icons-round text-[18px]">add_circle</span>
            <span>បន្ថែមថ្នាក់រៀនថ្មី</span>
        </a>
    </div>
@endsection

@section('content')

<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
    @php
        $totalClassrooms = $classrooms->total();
    @endphp
    <div class="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
            <span class="material-icons-round text-brand-500 text-[18px]">meeting_room</span>
        </div>
        <div>
            <p class="text-lg font-bold text-slate-800 leading-tight">{{ $totalClassrooms }}</p>
            <p class="text-xs text-slate-500 mt-0.5">ថ្នាក់រៀនសរុប</p>
        </div>
    </div>
    <div class="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
            <span class="material-icons-round text-sky-500 text-[18px]">list_alt</span>
        </div>
        <div>
            <p class="text-lg font-bold text-slate-800 leading-tight">{{ $classrooms->count() }}</p>
            <p class="text-xs text-slate-500 mt-0.5">ទំព័រនេះ</p>
        </div>
    </div>
    <div class="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
            <span class="material-icons-round text-teal-500 text-[18px]">science</span>
        </div>
        <div>
            <p class="text-lg font-bold text-slate-800 leading-tight">{{ $classrooms->getCollection()->where('track', 'science')->count() }}</p>
            <p class="text-xs text-slate-500 mt-0.5">វិទ្យាសាស្ត្រ</p>
        </div>
    </div>
    <div class="bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm">
        <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <span class="material-icons-round text-amber-500 text-[18px]">menu_book</span>
        </div>
        <div>
            <p class="text-lg font-bold text-slate-800 leading-tight">{{ $classrooms->getCollection()->where('track', 'social_science')->count() }}</p>
            <p class="text-xs text-slate-500 mt-0.5">វិទ្យាសាស្ត្រសង្គម</p>
        </div>
    </div>
</div>

<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-2">
            <span class="material-icons-round text-indigo-500 text-[20px]">meeting_room</span>
            <h2 class="font-semibold text-slate-800 text-sm">បញ្ជីថ្នាក់រៀន</h2>
            <span class="ml-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs px-2 py-0.5 rounded-full font-medium">{{ $totalClassrooms }}</span>
        </div>
        <form method="GET" action="{{ route('admin.classrooms.index') }}" id="classroomFilterForm" class="flex items-center gap-2">
            <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px] pointer-events-none">search</span>
                <input type="text"
                       id="classroomSearchInput"
                       name="search"
                       value="{{ $search }}"
                       placeholder="ស្វែងរកថ្នាក់រៀន…"
                       autocomplete="off"
                       class="bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all">
                @if($search)
                    <a href="{{ route('admin.classrooms.index') }}" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" title="សំអាត">
                        <span class="material-icons-round text-[16px]">cancel</span>
                    </a>
                @endif
            </div>
            <button type="submit" class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors shadow-sm">
                <span class="material-icons-round text-[16px]">search</span>
                ស្វែងរក
            </button>
        </form>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[800px]">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                    <th class="w-12 px-5 py-3 text-center font-semibold">
                        <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">ឈ្មោះថ្នាក់</th>
                    <th class="px-5 py-3 text-left font-semibold">កម្រិត/មុខវិជ្ជា</th>
                    <th class="px-5 py-3 text-left font-semibold">ឆ្នាំសិក្សា</th>
                    <th class="px-5 py-3 text-left font-semibold">គ្រូបន្ទុកថ្នាក់</th>
                    <th class="px-5 py-3 text-center font-semibold">ចំនួនសិស្ស</th>
                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($classrooms as $classroom)
                    <tr class="hover:bg-slate-50 transition-colors group">
                        <td class="px-5 py-4 text-center">
                            <input type="checkbox" value="{{ $classroom->id }}" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                        </td>
                        <td class="px-5 py-4 font-medium text-slate-800">{{ $classroom->name }}</td>
                        <td class="px-5 py-4">
                            <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">
                                {{ $classroom->grade?->level }}
                            </span>
                            @if($classroom->track === 'science')
                                <span class="inline-flex items-center gap-1 text-teal-600 text-[11px] ml-1"><span class="material-icons-round text-[12px]">science</span> វិទ្យាសាស្ត្រ</span>
                            @elseif($classroom->track === 'social_science')
                                <span class="inline-flex items-center gap-1 text-amber-600 text-[11px] ml-1"><span class="material-icons-round text-[12px]">menu_book</span> វិទ្យាសាស្ត្រសង្គម</span>
                            @endif
                        </td>
                        <td class="px-5 py-4 text-slate-700 text-sm">
                            {{ $classroom->academicYear?->name ?? '-' }}
                            @if($classroom->academicYear?->is_active)
                                <span class="ml-1 inline-flex items-center bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-200">សកម្ម</span>
                            @endif
                        </td>
                        <td class="px-5 py-4">
                            @if($classroom->homeroomTeacher?->teacherProfile)
                                <div class="flex items-center gap-2 text-slate-700 text-xs">
                                    <span class="material-icons-round text-[14px] text-slate-400">person</span>
                                    {{ $classroom->homeroomTeacher->teacherProfile->name_kh }}
                                </div>
                            @else
                                <span class="text-slate-400 text-xs italic">មិនទាន់មាន</span>
                            @endif
                        </td>
                        <td class="px-5 py-4 text-center text-slate-800 font-medium">
                            {{ $classroom->students_count }} 
                            @if($classroom->max_students)
                                <span class="text-slate-400 text-xs font-normal">/ {{ $classroom->max_students }}</span>
                            @endif
                        </td>
                        <td class="px-5 py-4 text-right">
                            <a href="{{ route('admin.classrooms.show', $classroom) }}" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-600 transition-all">
                                <span class="material-icons-round text-[16px]">visibility</span>
                            </a>
                            <a href="{{ route('admin.classrooms.edit', $classroom) }}" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 transition-all">
                                <span class="material-icons-round text-[16px]">edit</span>
                            </a>
                            <button onclick="openDeleteModal('{{ route('admin.classrooms.destroy', $classroom) }}', 'តើអ្នកចង់លុបថ្នាក់ {{ $classroom->name }} មែនទេ?')" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-all">
                                <span class="material-icons-round text-[16px]">delete</span>
                            </button>
                        </td>
                    </tr>
                @empty
                    <x-empty-state 
                        colspan="7"
                        icon="meeting_room"
                        title="មិនទាន់មានទិន្នន័យថ្នាក់រៀនទេ"
                        description="សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតថ្នាក់រៀនថ្មី។"
                        action_url="{{ route('admin.classrooms.create') }}"
                        action_text="បង្កើតថ្នាក់រៀនថ្មី"
                    />
                @endforelse
            </tbody>
        </table>
    </div>
    @include('components.pagination', ['paginator' => $classrooms, 'label' => 'ថ្នាក់'])
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('classroomSearchInput');
    const form = document.getElementById('classroomFilterForm');
    if (searchInput && form) {
        let timer = null;
        searchInput.addEventListener('input', function() {
            clearTimeout(timer);
            timer = setTimeout(function() {
                form.submit();
            }, 400);
        });
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
