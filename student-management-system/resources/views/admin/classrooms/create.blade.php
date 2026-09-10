@extends('layouts.admin')

@section('title', 'បន្ថែមថ្នាក់រៀន')
@section('page-title', 'បន្ថែមថ្នាក់រៀន')
@section('breadcrumb')
    <a href="{{ route('admin.classrooms.index') }}" class="hover:text-slate-700">ថ្នាក់រៀន</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-slate-500">បន្ថែមថ្មី</span>
@endsection

@section('content')

<div class="max-w-3xl mx-auto">
<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

    {{-- Card Header --}}
    <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50/70">
        <div class="w-11 h-11 bg-indigo-50 border border-indigo-200 rounded-xl
                    flex items-center justify-center flex-shrink-0">
            <span class="material-icons-round text-indigo-500 text-[22px]">add_circle</span>
        </div>
        <div>
            <h2 class="font-semibold text-slate-800">ព័ត៌មានថ្នាក់រៀន</h2>
            <p class="text-xs text-slate-500 mt-0.5">
                បំពេញព័ត៌មានខាងក្រោម ដើម្បីបន្ថែមថ្នាក់រៀនថ្មី
            </p>
        </div>
    </div>

    <form method="POST"
          action="{{ route('admin.classrooms.store') }}"
          id="form-create-classroom"
          class="p-6 space-y-6">
        @csrf

        {{-- ── Section 1: Identity ── --}}
        <div>
            <div class="flex items-center gap-2 mb-4">
                <span class="material-icons-round text-indigo-500 text-[18px]">info</span>
                <h3 class="text-sm font-semibold text-slate-800 uppercase tracking-wide">ព័ត៌មានថ្នាក់</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {{-- Class Name --}}
                <div class="sm:col-span-1">
                    <label for="name" class="block text-sm font-medium text-slate-700 mb-1.5">
                        ឈ្មោះថ្នាក់ <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">meeting_room</span>
                        <input type="text"
                               id="name"
                               name="name"
                               value="{{ old('name') }}"
                               placeholder="ឧ. 12A, 11SC1"
                               class="w-full bg-white border text-slate-800 placeholder-slate-400 rounded-xl
                                      pl-10 pr-4 py-2.5 text-sm font-semibold transition-all duration-150
                                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                      {{ $errors->has('name') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                    </div>
                    @error('name')
                        <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                            <span class="material-icons-round text-[14px]">error_outline</span>
                            <span>{{ $message }}</span>
                        </div>
                    @enderror
                </div>

                {{-- Grade Level --}}
                <div class="sm:col-span-1">
                    <label for="grade_id" class="block text-sm font-medium text-slate-700 mb-1.5">
                        ថ្នាក់ទី <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">layers</span>
                        <select id="grade_id"
                                name="grade_id"
                                onchange="handleGradeChange(this.value)"
                                class="w-full appearance-none bg-white border text-sm rounded-xl
                                       pl-10 pr-9 py-2.5 transition-all duration-150 text-slate-800
                                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                       {{ $errors->has('grade_id') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                            <option value="" disabled {{ old('grade_id') ? '' : 'selected' }} class="text-slate-500">
                                — ជ្រើសរើសថ្នាក់ទី —
                            </option>
                            @foreach($grades as $grade)
                                <option value="{{ $grade->id }}"
                                        data-level="{{ $grade->level }}"
                                        {{ old('grade_id') == $grade->id ? 'selected' : '' }}>
                                    ថ្នាក់ទី {{ $grade->level }} — {{ $grade->name }}
                                </option>
                            @endforeach
                        </select>
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px] pointer-events-none">expand_more</span>
                    </div>
                    @error('grade_id')
                        <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                            <span class="material-icons-round text-[14px]">error_outline</span>
                            <span>{{ $message }}</span>
                        </div>
                    @enderror
                </div>

                {{-- Academic Year --}}
                <div class="sm:col-span-1">
                    <label for="academic_year_id" class="block text-sm font-medium text-slate-700 mb-1.5">
                        ឆ្នាំសិក្សា <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">calendar_today</span>
                        <select id="academic_year_id"
                                name="academic_year_id"
                                class="w-full appearance-none bg-white border text-sm rounded-xl
                                       pl-10 pr-9 py-2.5 transition-all duration-150 text-slate-800
                                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                       {{ $errors->has('academic_year_id') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                            <option value="" disabled {{ old('academic_year_id') ? '' : 'selected' }} class="text-slate-500">
                                — ជ្រើសរើសឆ្នាំ —
                            </option>
                            @foreach($academicYears as $year)
                                <option value="{{ $year->id }}"
                                        {{ old('academic_year_id') == $year->id ? 'selected' : '' }}>
                                    {{ $year->name }}{{ $year->is_active ? ' ✦ (បច្ចុប្បន្ន)' : '' }}
                                </option>
                            @endforeach
                        </select>
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px] pointer-events-none">expand_more</span>
                    </div>
                    @error('academic_year_id')
                        <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                            <span class="material-icons-round text-[14px]">error_outline</span>
                            <span>{{ $message }}</span>
                        </div>
                    @enderror
                </div>

                {{-- Homeroom Teacher --}}
                <div class="sm:col-span-1">
                    <label for="teacher_profile_id" class="block text-sm font-medium text-slate-700 mb-1.5">
                        គ្រូបន្ទុកថ្នាក់
                        <span class="text-slate-500 font-normal">(ស្រេចចិត្ត)</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">person</span>
                        <select id="teacher_profile_id"
                                name="teacher_profile_id"
                                class="w-full appearance-none bg-white border border-slate-300 hover:border-slate-400
                                       text-sm rounded-xl pl-10 pr-9 py-2.5 transition-all text-slate-800
                                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
                            <option value="">— គ្មានគ្រូបន្ទុកថ្នាក់ —</option>
                            @foreach($teachers as $teacher)
                                <option value="{{ $teacher->id }}"
                                        {{ old('teacher_profile_id') == $teacher->id ? 'selected' : '' }}>
                                    {{ $teacher->name_en }} ({{ $teacher->teacher_code }})
                                </option>
                            @endforeach
                        </select>
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px] pointer-events-none">expand_more</span>
                    </div>
                </div>

                {{-- Room (optional) --}}
                <div class="sm:col-span-1">
                    <label for="room" class="block text-sm font-medium text-slate-700 mb-1.5">
                        បន្ទប់ <span class="text-slate-500 font-normal">(ស្រេចចិត្ត)</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">door_front</span>
                        <input type="text"
                               id="room"
                               name="room"
                               value="{{ old('room') }}"
                               placeholder="ឧ. B-201"
                               class="w-full bg-white border border-slate-300 hover:border-slate-400
                                      text-slate-800 placeholder-slate-400 rounded-xl
                                      pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
                    </div>
                </div>

                {{-- Max Students (optional) --}}
                <div class="sm:col-span-1">
                    <label for="max_students" class="block text-sm font-medium text-slate-700 mb-1.5">
                        ចំនួនអតិបរមា <span class="text-slate-500 font-normal">(លំនាំដើម: ៤០)</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">groups</span>
                        <input type="number"
                               id="max_students"
                               name="max_students"
                               value="{{ old('max_students', 40) }}"
                               min="1" max="60"
                               class="w-full bg-white border border-slate-300 hover:border-slate-400
                                      text-slate-800 placeholder-slate-400 rounded-xl
                                      pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
                    </div>
                </div>

            </div>
        </div>

        {{-- Divider --}}
        <div class="border-t border-slate-200"></div>

        {{-- ── Section 2: Track Selector ── --}}
        <div id="track-section">
            <div class="flex items-center gap-2 mb-2">
                <span class="material-icons-round text-indigo-500 text-[18px]">fork_right</span>
                <h3 class="text-sm font-semibold text-slate-800 uppercase tracking-wide">ផ្លូវវិជ្ជា (Track)</h3>
            </div>
            <p id="track-note" class="text-xs text-slate-500 mb-4">ជ្រើសរើស Track ដែលត្រូវនឹងថ្នាក់ (ថ្នាក់ទី ១០ ប្រើ "ទូទៅ" តែប៉ុណ្ណោះ)</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {{-- Science --}}
                <label for="track_science"
                       class="relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer
                              transition-all duration-150 group bg-white
                              has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50
                              border-slate-200 hover:border-slate-300 hover:bg-slate-50
                              track-card" id="card-science">
                    <input type="radio"
                           id="track_science"
                           name="track"
                           value="science"
                           class="sr-only"
                           {{ old('track') === 'science' ? 'checked' : '' }}>
                    <div class="w-10 h-10 bg-teal-50 border border-teal-200 rounded-xl
                                flex items-center justify-center group-has-[:checked]:bg-teal-100">
                        <span class="material-icons-round text-teal-600 text-[20px]">science</span>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-slate-800">វិទ្យាសាស្ត្រពិត</p>
                        <p class="text-xs text-slate-500 mt-0.5">Science Track</p>
                    </div>
                    <span class="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-slate-300
                                 group-has-[:checked]:border-teal-500 group-has-[:checked]:bg-teal-500
                                 flex items-center justify-center transition-all">
                        <span class="material-icons-round text-white text-[10px] opacity-0 group-has-[:checked]:opacity-100">check</span>
                    </span>
                </label>

                {{-- Social Science --}}
                <label for="track_social"
                       class="relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer
                              transition-all duration-150 group bg-white
                              has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50
                              border-slate-200 hover:border-slate-300 hover:bg-slate-50
                              track-card" id="card-social">
                    <input type="radio"
                           id="track_social"
                           name="track"
                           value="social_science"
                           class="sr-only"
                           {{ old('track') === 'social_science' ? 'checked' : '' }}>
                    <div class="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl
                                flex items-center justify-center group-has-[:checked]:bg-amber-100">
                        <span class="material-icons-round text-amber-600 text-[20px]">account_balance</span>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-slate-800">វិទ្យាសាស្ត្រសង្គម</p>
                        <p class="text-xs text-slate-500 mt-0.5">Social Science</p>
                    </div>
                    <span class="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-slate-300
                                 group-has-[:checked]:border-amber-500 group-has-[:checked]:bg-amber-500
                                 flex items-center justify-center transition-all">
                        <span class="material-icons-round text-white text-[10px] opacity-0 group-has-[:checked]:opacity-100">check</span>
                    </span>
                </label>

                {{-- General (Grade 10) --}}
                <label for="track_general"
                       class="relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer
                              transition-all duration-150 group bg-white
                              has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50
                              border-slate-200 hover:border-slate-300 hover:bg-slate-50
                              track-card" id="card-general">
                    <input type="radio"
                           id="track_general"
                           name="track"
                           value=""
                           class="sr-only"
                           {{ !old('track') ? 'checked' : '' }}>
                    <div class="w-10 h-10 bg-sky-50 border border-sky-200 rounded-xl
                                flex items-center justify-center group-has-[:checked]:bg-sky-100">
                        <span class="material-icons-round text-sky-600 text-[20px]">menu_book</span>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-slate-800">ទូទៅ</p>
                        <p class="text-xs text-slate-500 mt-0.5">General (ថ្នាក់ទី ១០)</p>
                    </div>
                    <span class="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-slate-300
                                 group-has-[:checked]:border-sky-500 group-has-[:checked]:bg-sky-500
                                 flex items-center justify-center transition-all">
                        <span class="material-icons-round text-white text-[10px] opacity-0 group-has-[:checked]:opacity-100">check</span>
                    </span>
                </label>

            </div>

            {{-- Grade 10 alert (shown via JS) --}}
            <div id="grade10-alert"
                 class="hidden mt-3 flex items-start gap-2 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3">
                <span class="material-icons-round text-sky-500 text-[16px] flex-shrink-0 mt-0.5">info</span>
                <p class="text-xs text-sky-700 leading-relaxed">
                    ថ្នាក់ទី <span class="font-semibold">១០</span>
                    ប្រើប្រព័ន្ធ <span class="font-semibold">ទូទៅ</span> ប៉ុណ្ណោះ។
                    ផ្លូវវិជ្ជា Science/Social ចាប់ផ្ដើមពីថ្នាក់ទី <span class="font-semibold">១១</span>
                    ក្រោយ Orientation Period។
                </p>
            </div>
        </div>

        {{-- Divider --}}
        <div class="border-t border-slate-200"></div>

        {{-- Actions --}}
        <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-1">
            <a href="{{ route('admin.classrooms.index') }}"
               class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                      bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400
                      text-slate-600 hover:text-slate-800 font-medium text-sm
                      px-5 py-2.5 rounded-xl transition-all duration-150">
                <span class="material-icons-round text-[18px]">arrow_back</span>
                បោះបង់
            </a>
            <button type="submit"
                    id="btn-submit-classroom"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                           bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm
                           px-6 py-2.5 rounded-xl transition-all duration-150
                           shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="material-icons-round text-[18px]">save</span>
                រក្សាទុកថ្នាក់
            </button>
        </div>

    </form>
</div>
</div>

@endsection

@push('scripts')
<script>
    // Grade level → Track selector behaviour
    // Collect grade level from selected <option data-level="...">
    function handleGradeChange(gradeId) {
        const select   = document.getElementById('grade_id');
        const selected = select.querySelector(`option[value="${gradeId}"]`);
        const level    = selected ? parseInt(selected.dataset.level) : null;

        const cardScience = document.getElementById('card-science');
        const cardSocial  = document.getElementById('card-social');
        const alert10     = document.getElementById('grade10-alert');

        if (level === 10) {
            // Grade 10 → force General, disable Science & Social
            document.getElementById('track_general').checked = true;
            cardScience.classList.add('opacity-30', 'pointer-events-none');
            cardSocial.classList.add('opacity-30', 'pointer-events-none');
            alert10.classList.replace('hidden', 'flex');
        } else {
            // Grade 11/12 → all tracks available
            cardScience.classList.remove('opacity-30', 'pointer-events-none');
            cardSocial.classList.remove('opacity-30', 'pointer-events-none');
            alert10.classList.replace('flex', 'hidden');
        }
    }

    // Run on page load in case of old() value
    window.addEventListener('DOMContentLoaded', () => {
        const gradeId = document.getElementById('grade_id').value;
        if (gradeId) handleGradeChange(gradeId);
    });

    // Submit protection
    document.getElementById('form-create-classroom').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-classroom');
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            កំពុងរក្សាទុក…
        `;
    });
</script>
@endpush
