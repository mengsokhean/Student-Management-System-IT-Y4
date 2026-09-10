@extends('layouts.admin')

@section('title', 'គ្រូបង្រៀន')
@section('page-title', 'គ្រូបង្រៀន')
@section('breadcrumb')
    <span class="text-slate-500">គ្រូបង្រៀន</span>
@endsection

@section('header-actions')
    <div class="flex items-center gap-2">
        {{-- Import Button --}}
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_download</span>
            Import
        </button>
        {{-- Export Button --}}
        <a href="{{ route('admin.teachers.export') }}" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_upload</span>
            Export
        </a>
        {{-- Add New --}}
        <a href="{{ route('admin.teachers.create') }}" class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30">
            <span class="material-icons-round text-[18px]">person_add</span>
            <span>បន្ថែមគ្រូថ្មី</span>
        </a>
    </div>
@endsection

@section('content')

{{-- ── Stats Row ── --}}
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
    @php
        $statItems = [
            ['label' => 'គ្រូសរុប',      'value' => $totalTeachers,   'icon' => 'groups',        'color' => 'brand'],
            ['label' => 'គ្រូប្រុស',       'value' => $maleTeachers,    'icon' => 'male',          'color' => 'sky'],
            ['label' => 'គ្រូស្រី',        'value' => $femaleTeachers,  'icon' => 'female',        'color' => 'pink'],
            ['label' => 'កំពុងសកម្ម',     'value' => $activeTeachers,  'icon' => 'verified_user', 'color' => 'emerald'],
        ];
    @endphp

    @foreach ($statItems as $stat)
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-{{ $stat['color'] }}-50 flex items-center justify-center flex-shrink-0 border border-{{ $stat['color'] }}-100">
                <span class="material-icons-round text-{{ $stat['color'] }}-500 text-[20px]">{{ $stat['icon'] }}</span>
            </div>
            <div>
                <p class="text-xl font-bold text-slate-800 leading-tight">{{ $stat['value'] }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ $stat['label'] }}</p>
            </div>
        </div>
    @endforeach
</div>

{{-- ── Teacher Table ── --}}
<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

    {{-- Table Header + Search --}}
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-2">
            <span class="material-icons-round text-indigo-500 text-[20px]">manage_accounts</span>
            <h2 class="font-semibold text-slate-800 text-sm">បញ្ជីគ្រូបង្រៀន</h2>
            <span class="ml-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs px-2 py-0.5 rounded-full font-medium">
                {{ $teachers->total() }}
            </span>
            @if($search)
                <span class="ml-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span class="material-icons-round text-[12px]">filter_alt</span>
                    ស្វែងរក: &ldquo;{{ $search }}&rdquo;
                    <a href="{{ route('admin.teachers.index') }}" class="ml-1 hover:text-amber-900">
                        <span class="material-icons-round text-[12px]">close</span>
                    </a>
                </span>
            @endif
        </div>
        {{-- Live Search Form & Filters --}}
        <form method="GET" action="{{ route('admin.teachers.index') }}" id="teacherFilterForm" class="flex items-center gap-2">
            <div class="relative">
                <span class="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">search</span>
                <input type="text"
                       id="teacherSearchInput"
                       name="search"
                       value="{{ $search }}"
                       placeholder="ស្វែងរកគ្រូ…"
                       autocomplete="off"
                       class="bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all">
                @if($search)
                    <a href="{{ route('admin.teachers.index', array_filter(['status' => $status])) }}" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" title="សំអាត">
                        <span class="material-icons-round text-[16px]">cancel</span>
                    </a>
                @endif
            </div>
            
            <select name="status" class="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all">
                <option value="">ជ្រើសរើសស្ថានភាព</option>
                <option value="active" {{ (isset($status) && $status === 'active') ? 'selected' : '' }}>សកម្ម</option>
                <option value="inactive" {{ (isset($status) && $status === 'inactive') ? 'selected' : '' }}>អសកម្ម</option>
            </select>

            <button type="submit" class="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl transition-colors shadow-sm">
                <span class="material-icons-round text-[16px]">search</span>
                ស្វែងរក
            </button>
        </form>
    </div>

    {{-- Responsive Table --}}
    <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[700px]">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                    <th class="w-12 px-5 py-3 text-center font-semibold">
                        <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">
                        <div class="flex items-center gap-1">
                            <span class="material-icons-round text-[14px]">badge</span>
                            អត្តលេខ
                        </div>
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">
                        <div class="flex items-center gap-1">
                            <span class="material-icons-round text-[14px]">person</span>
                            ឈ្មោះ (ខ្មែរ)
                        </div>
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">ឈ្មោះ (អក្សរលោក)</th>
                    <th class="px-5 py-3 text-left font-semibold">
                        <div class="flex items-center gap-1">
                            <span class="material-icons-round text-[14px]">email</span>
                            អ៊ីម៉ែល
                        </div>
                    </th>
                    <th class="px-5 py-3 text-center font-semibold">ភេទ</th>
                    <th class="px-5 py-3 text-center font-semibold">ស្ថានភាព</th>
                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse ($teachers as $teacher)
                    <tr class="hover:bg-slate-50 transition-colors duration-100 group">

                        <td class="px-5 py-4 text-center">
                            <input type="checkbox" value="{{ $teacher->id }}" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                        </td>

                        {{-- Teacher Code --}}
                        <td class="px-5 py-4">
                            <span class="inline-flex items-center bg-amber-50 border border-amber-200
                                         text-amber-700 font-mono text-xs px-2.5 py-1 rounded-lg">
                                {{ $teacher->teacher_code }}
                            </span>
                        </td>

                        {{-- Name KH --}}
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3">
                                {{-- Avatar --}}
                                <div class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center
                                            {{ $teacher->gender === 'female' ? 'bg-pink-50 border border-pink-200' : 'bg-sky-50 border border-sky-200' }}">
                                    <span class="material-icons-round text-[18px]
                                                 {{ $teacher->gender === 'female' ? 'text-pink-500' : 'text-sky-500' }}">
                                        {{ $teacher->gender === 'female' ? 'face_3' : 'face' }}
                                    </span>
                                </div>
                                <span class="font-medium text-slate-800">{{ $teacher->name_kh }}</span>
                            </div>
                        </td>

                        {{-- Name EN --}}
                        <td class="px-5 py-4 text-slate-600">{{ $teacher->name_en }}</td>

                        {{-- Email --}}
                        <td class="px-5 py-4 text-slate-500 text-xs">{{ $teacher->user?->email ?? '—' }}</td>

                        {{-- Gender --}}
                        <td class="px-5 py-4 text-center">
                            @if($teacher->gender === 'female')
                                <span class="inline-flex items-center gap-1 bg-pink-50 border border-pink-200
                                             text-pink-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                    <span class="material-icons-round text-[12px]">female</span>
                                    ស្រី
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 bg-sky-50 border border-sky-200
                                             text-sky-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                    <span class="material-icons-round text-[12px]">male</span>
                                    ប្រុស
                                </span>
                            @endif
                        </td>

                        {{-- Active Status --}}
                        <td class="px-5 py-4 text-center">
                            @if($teacher->user?->is_active)
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
                            <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">

                                {{-- View --}}
                                <a href="{{ route('admin.teachers.show', $teacher) }}"
                                   title="មើលព័ត៌មាន"
                                   class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                          bg-slate-100 hover:bg-sky-100 border border-slate-200
                                          hover:border-sky-300 text-slate-500 hover:text-sky-600
                                          transition-all duration-150">
                                    <span class="material-icons-round text-[16px]">visibility</span>
                                </a>

                                {{-- Edit --}}
                                <a href="{{ route('admin.teachers.edit', $teacher) }}"
                                   title="កែប្រែ"
                                   class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                          bg-slate-100 hover:bg-indigo-100 border border-slate-200
                                          hover:border-indigo-300 text-slate-500 hover:text-indigo-600
                                          transition-all duration-150">
                                    <span class="material-icons-round text-[16px]">edit</span>
                                </a>

                                {{-- Delete --}}
                                <button type="button"
                                        title="លុប"
                                        onclick="openDeleteModal(
                                            '{{ route('admin.teachers.destroy', $teacher) }}',
                                            'តើអ្នកពិតជាចង់លុប {{ addslashes($teacher->name_en) }} ({{ addslashes($teacher->teacher_code) }}) មែនទេ?'
                                        )"
                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                               bg-slate-100 hover:bg-red-100 border border-slate-200
                                               hover:border-red-300 text-slate-500 hover:text-red-600
                                               transition-all duration-150">
                                    <span class="material-icons-round text-[16px]">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <x-empty-state 
                        colspan="8"
                        icon="person_off"
                        title="មិនទាន់មានទិន្នន័យគ្រូបង្រៀនទេ"
                        description="សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតគ្រូបង្រៀនថ្មី។"
                        action_url="{{ route('admin.teachers.create') }}"
                        action_text="បង្កើតគ្រូបង្រៀនថ្មី"
                    />
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- ── Pagination ── --}}
    @include('components.pagination', ['paginator' => $teachers, 'label' => 'នាក់'])

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('teacherSearchInput');
    const form = document.getElementById('teacherFilterForm');
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
