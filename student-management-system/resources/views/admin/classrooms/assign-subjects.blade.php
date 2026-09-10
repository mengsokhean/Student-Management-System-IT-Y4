@extends('layouts.admin')

@section('title', 'ចាត់តាំងគ្រូមុខវិជ្ជា — ' . $classroom->name)
@section('page-title', 'ចាត់តាំងគ្រូមុខវិជ្ជា')
@section('breadcrumb')
    <a href="{{ route('admin.classrooms.index') }}" class="hover:text-gray-300">ថ្នាក់រៀន</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <a href="{{ route('admin.classrooms.show', $classroom) }}" class="hover:text-gray-300">{{ $classroom->name }}</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">ចាត់តាំងគ្រូមុខវិជ្ជា</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.classrooms.show', $classroom) }}"
       class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700
              hover:border-gray-600 text-gray-300 hover:text-white text-sm font-medium
              px-4 py-2 rounded-xl transition-all">
        <span class="material-icons-round text-[18px]">arrow_back</span>
        <span>ត្រឡប់ក្រោយ</span>
    </a>
@endsection

@section('content')

<div class="max-w-4xl mx-auto">

    {{-- Classroom Header Info --}}
    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6
                bg-gradient-to-br from-gray-900 to-gray-800/50">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0
                            @if($classroom->track === 'science') bg-teal-950/70 border border-teal-700/50 text-teal-300
                            @elseif($classroom->track === 'social_science') bg-amber-950/70 border border-amber-700/50 text-amber-300
                            @else bg-sky-950/70 border border-sky-700/50 text-sky-300 @endif">
                    {{ $classroom->grade?->level }}
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-white">{{ $classroom->name }}</h2>
                    <div class="flex items-center gap-3 mt-1 text-sm">
                        <span class="text-gray-400">ថ្នាក់ទី {{ $classroom->grade?->level }}</span>
                        <span class="text-gray-600">&bull;</span>
                        <span class="text-gray-400">{{ $classroom->academicYear?->name }}</span>
                        <span class="text-gray-600">&bull;</span>
                        @if($classroom->track === 'science')
                            <span class="inline-flex items-center gap-1 text-teal-400 font-medium">
                                <span class="material-icons-round text-[14px]">science</span> វិទ្យាសាស្ត្រ
                            </span>
                        @elseif($classroom->track === 'social_science')
                            <span class="inline-flex items-center gap-1 text-amber-400 font-medium">
                                <span class="material-icons-round text-[14px]">account_balance</span> វិទ្យាសាស្ត្រសង្គម
                            </span>
                        @else
                            <span class="inline-flex items-center gap-1 text-sky-400 font-medium">
                                <span class="material-icons-round text-[14px]">menu_book</span> ទូទៅ
                            </span>
                        @endif
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 flex flex-col items-end">
                <span class="text-xs text-gray-500 mb-0.5">មុខវិជ្ជាសរុប</span>
                <span class="text-lg font-bold text-white">{{ $subjects->count() }}</span>
            </div>
        </div>
    </div>

    @if($subjects->isEmpty())
        {{-- Empty State --}}
        <div class="bg-gray-900 border border-gray-800 rounded-2xl py-16 px-6 text-center">
            <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <span class="material-icons-round text-gray-500 text-4xl">menu_book</span>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">មិនទាន់មានមុខវិជ្ជាសម្រាប់ថ្នាក់នេះទេ</h3>
            <p class="text-sm text-gray-400 max-w-md mx-auto mb-6">
                សូមចូលទៅកាន់ការគ្រប់គ្រងមុខវិជ្ជា ហើយភ្ជាប់មុខវិជ្ជាទៅកាន់ថ្នាក់ទី {{ $classroom->grade?->level }} 
                @if($classroom->track === 'science') មុខវិជ្ជាវិទ្យាសាស្ត្រ
                @elseif($classroom->track === 'social_science') មុខវិជ្ជាវិទ្យាសាស្ត្រសង្គម
                @endif
                ជាមុនសិន។
            </p>
            <a href="{{ route('admin.subjects.index') }}" 
               class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white 
                      text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-600/20">
                <span class="material-icons-round text-[18px]">settings</span>
                កំណត់រចនាសម្ព័ន្ធមុខវិជ្ជា
            </a>
        </div>
    @else
        {{-- Assignment Form --}}
        <form method="POST" action="{{ route('admin.classrooms.store-assignments', $classroom) }}" id="form-assign-subjects">
            @csrf

            <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
                <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-800/30">
                    <span class="material-icons-round text-brand-400 text-[18px]">assignment_ind</span>
                    <h3 class="font-semibold text-white text-sm">បញ្ជីមុខវិជ្ជា និងគ្រូបង្រៀន</h3>
                </div>

                <div class="divide-y divide-gray-800/60">
                    @foreach($subjects as $subject)
                        <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-800/20 transition-colors">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-base font-medium text-white">{{ $subject->name_kh }}</span>
                                    <span class="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded-md border border-gray-700">
                                        {{ $subject->code }}
                                    </span>
                                </div>
                                <p class="text-xs text-gray-400">{{ $subject->name_en }}</p>
                            </div>
                            
                            <div class="w-full sm:w-72 relative flex-shrink-0">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px] z-10 pointer-events-none">
                                    person
                                </span>
                                <select name="assignments[{{ $subject->id }}]" 
                                        class="w-full appearance-none bg-gray-800 border border-gray-700 hover:border-gray-600 
                                               text-sm rounded-xl pl-10 pr-9 py-2.5 transition-all text-white
                                               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                                    <option value="">— មិនទាន់ចាត់តាំង —</option>
                                    @foreach($teachers as $teacher)
                                        <option value="{{ $teacher->id }}" 
                                                {{ (isset($assignments[$subject->id]) && $assignments[$subject->id] == $teacher->id) ? 'selected' : '' }}>
                                            {{ $teacher->name_kh }} ({{ $teacher->name_en }})
                                        </option>
                                    @endforeach
                                </select>
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px] pointer-events-none z-10">
                                    expand_more
                                </span>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Sticky Submit --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 sticky bottom-6 shadow-2xl flex items-center justify-between z-20">
                <p class="text-sm text-gray-400 hidden sm:block">
                    សូមពិនិត្យមើលអោយបានត្រឹមត្រូវមុននឹងរក្សាទុក។
                </p>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <a href="{{ route('admin.classrooms.show', $classroom) }}"
                       class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                              bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                              text-gray-300 hover:text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all">
                        បោះបង់
                    </a>
                    <button type="submit"
                            id="btn-submit-assignments"
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                                   bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm
                                   px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-600/20">
                        <span class="material-icons-round text-[18px]">save</span>
                        រក្សាទុកការចាត់តាំង
                    </button>
                </div>
            </div>
        </form>
    @endif

</div>

@endsection

@push('scripts')
<script>
    const form = document.getElementById('form-assign-subjects');
    if (form) {
        form.addEventListener('submit', function () {
            const btn = document.getElementById('btn-submit-assignments');
            btn.disabled = true;
            btn.innerHTML = `
                <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                កំពុងរក្សាទុក…
            `;
        });
    }
</script>
@endpush
