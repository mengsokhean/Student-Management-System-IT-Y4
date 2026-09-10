@extends('layouts.admin')

@section('title', 'មុខវិជ្ជា')
@section('page-title', 'មុខវិជ្ជា')
@section('breadcrumb')
    <span class="text-slate-500">មុខវិជ្ជា</span>
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
        <a href="{{ route('admin.subjects.create') }}" class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30">
            <span class="material-icons-round text-[18px]">add_circle</span>
            <span>បន្ថែមមុខវិជ្ជាថ្មី</span>
        </a>
    </div>
@endsection

@section('content')

<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-2">
            <span class="material-icons-round text-indigo-500 text-[20px]">menu_book</span>
            <h2 class="font-semibold text-slate-800 text-sm">បញ្ជីមុខវិជ្ជា</h2>
            <span class="ml-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs px-2 py-0.5 rounded-full font-medium">{{ $subjects->total() }}</span>
            @if($search)
                <span class="ml-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span class="material-icons-round text-[12px]">filter_alt</span>
                    ស្វែងរក: &ldquo;{{ $search }}&rdquo;
                    <a href="{{ route('admin.subjects.index') }}" class="ml-1 hover:text-amber-900">
                        <span class="material-icons-round text-[12px]">close</span>
                    </a>
                </span>
            @endif
        </div>
        <form method="GET" action="{{ route('admin.subjects.index') }}" id="subjectFilterForm" class="flex items-center gap-2">
            <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px] pointer-events-none">search</span>
                <input type="text"
                       id="subjectSearchInput"
                       name="search"
                       value="{{ $search }}"
                       placeholder="ស្វែងរកមុខវិជ្ជា…"
                       autocomplete="off"
                       class="bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all">
                @if($search)
                    <a href="{{ route('admin.subjects.index') }}" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" title="សំអាត">
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
        <table class="w-full text-sm min-w-[600px]">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                    <th class="w-12 px-5 py-3 text-center font-semibold">
                        <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">កូដ</th>
                    <th class="px-5 py-3 text-left font-semibold">ឈ្មោះមុខវិជ្ជា</th>
                    <th class="px-5 py-3 text-left font-semibold">កម្រិតថ្នាក់</th>
                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($subjects as $subject)
                    <tr class="hover:bg-slate-50 transition-colors group">
                        <td class="px-5 py-4 text-center">
                            <input type="checkbox" value="{{ $subject->id }}" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                        </td>
                        <td class="px-5 py-4 font-medium text-slate-800">{{ $subject->code }}</td>
                        <td class="px-5 py-4">
                            <span class="font-medium text-slate-800">{{ $subject->name_kh }}</span>
                            <span class="text-xs text-slate-500 ml-2">{{ $subject->name_en }}</span>
                        </td>
                        <td class="px-5 py-4 text-slate-600">
                            {{ $subject->grades_count }} កម្រិត
                        </td>
                        <td class="px-5 py-4 text-right">
                            <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <a href="{{ route('admin.subjects.edit', $subject) }}"
                                   title="កែប្រែ"
                                   class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-100 border border-slate-200 hover:border-indigo-300 text-slate-500 hover:text-indigo-600 transition-all">
                                    <span class="material-icons-round text-[16px]">edit</span>
                                </a>
                                <button type="button"
                                        title="លុប"
                                        onclick="openDeleteModal('{{ route('admin.subjects.destroy', $subject) }}', 'តើអ្នកចង់លុបមុខវិជ្ជា {{ addslashes($subject->name_en) }} ({{ addslashes($subject->code) }}) មែនទេ?')"
                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 transition-all">
                                    <span class="material-icons-round text-[16px]">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <x-empty-state 
                        colspan="5"
                        icon="menu_book"
                        title="មិនទាន់មានទិន្នន័យមុខវិជ្ជាទេ"
                        description="សូមចុចប៊ូតុងខាងក្រោមដើម្បីបន្ថែមមុខវិជ្ជាថ្មី។"
                        action_url="{{ route('admin.subjects.create') }}"
                        action_text="បន្ថែមមុខវិជ្ជាថ្មី"
                    />
                @endforelse
            </tbody>
        </table>
    </div>
    @include('components.pagination', ['paginator' => $subjects, 'label' => 'មុខវិជ្ជា'])
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('subjectSearchInput');
    const form = document.getElementById('subjectFilterForm');
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
