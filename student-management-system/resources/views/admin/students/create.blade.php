@extends('layouts.admin')

@section('title', 'ចុះឈ្មោះសិស្ស')
@section('page-title', 'ចុះឈ្មោះសិស្សថ្មី')
@section('breadcrumb')
    <a href="{{ route('admin.students.index') }}" class="hover:text-gray-300">សិស្ស</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">ចុះឈ្មោះថ្មី</span>
@endsection

@section('content')

<form method="POST"
      action="{{ route('admin.students.store') }}"
      id="form-create-student"
      class="max-w-6xl mx-auto">
    @csrf

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {{-- ════════════════════════════════════════
             LEFT (2/3): Personal Information
        ════════════════════════════════════════ --}}
        <div class="lg:col-span-2 space-y-5">

            {{-- Card: Personal Info --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-800 bg-gray-800/30">
                    <div class="w-11 h-11 bg-brand-950/80 border border-brand-800/50 rounded-xl
                                flex items-center justify-center flex-shrink-0">
                        <span class="material-icons-round text-brand-400 text-[22px]">person_add</span>
                    </div>
                    <div>
                        <h2 class="font-semibold text-white">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
                        <p class="text-xs text-gray-400 mt-0.5">ទិន្នន័យមូលដ្ឋានរបស់សិស្ស</p>
                    </div>
                </div>

                <div class="p-6 space-y-5">

                    {{-- Student Code --}}
                    <div>
                        <label for="student_code" class="block text-sm font-medium text-gray-300 mb-1.5">
                            លេខកូដសិស្ស <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">badge</span>
                            <input type="text" id="student_code" name="student_code"
                                   value="{{ old('student_code') }}"
                                   placeholder="ឧ. STU-2024-001"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm font-mono transition-all
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('student_code') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                        </div>
                        @error('student_code')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Names Row --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label for="name_kh" class="block text-sm font-medium text-gray-300 mb-1.5">
                                ឈ្មោះ (ភាសាខ្មែរ) <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">person</span>
                                <input type="text" id="name_kh" name="name_kh"
                                       value="{{ old('name_kh') }}" placeholder="ឧ. សុខ ចន្ទ"
                                       class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                              pl-10 pr-4 py-2.5 text-sm transition-all
                                              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                              {{ $errors->has('name_kh') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                            </div>
                            @error('name_kh')
                                <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                    <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                                </div>
                            @enderror
                        </div>
                        <div>
                            <label for="name_en" class="block text-sm font-medium text-gray-300 mb-1.5">
                                ឈ្មោះ (អក្សរលោក) <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">person_outline</span>
                                <input type="text" id="name_en" name="name_en"
                                       value="{{ old('name_en') }}" placeholder="ឧ. Sok Chan"
                                       class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                              pl-10 pr-4 py-2.5 text-sm transition-all
                                              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                              {{ $errors->has('name_en') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                            </div>
                            @error('name_en')
                                <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                    <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                                </div>
                            @enderror
                        </div>
                    </div>

                    {{-- Gender + DOB Row --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label for="gender" class="block text-sm font-medium text-gray-300 mb-1.5">
                                ភេទ <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">wc</span>
                                <select id="gender" name="gender"
                                        class="w-full appearance-none bg-gray-800 border text-sm rounded-xl
                                               pl-10 pr-9 py-2.5 transition-all text-white
                                               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                               {{ $errors->has('gender') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                                    <option value="" disabled {{ old('gender') ? '' : 'selected' }}>— ជ្រើសរើស —</option>
                                    <option value="male"   {{ old('gender') === 'male'   ? 'selected' : '' }}>ប្រុស</option>
                                    <option value="female" {{ old('gender') === 'female' ? 'selected' : '' }}>ស្រី</option>
                                </select>
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px] pointer-events-none">expand_more</span>
                            </div>
                            @error('gender')
                                <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                    <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                                </div>
                            @enderror
                        </div>
                        <div>
                            <label for="date_of_birth" class="block text-sm font-medium text-gray-300 mb-1.5">
                                ថ្ងៃខែឆ្នាំកំណើត <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">cake</span>
                                <input type="date" id="date_of_birth" name="date_of_birth"
                                       value="{{ old('date_of_birth') }}"
                                       class="w-full bg-gray-800 border text-white rounded-xl
                                              pl-10 pr-4 py-2.5 text-sm transition-all [color-scheme:dark]
                                              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                              {{ $errors->has('date_of_birth') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                            </div>
                            @error('date_of_birth')
                                <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                    <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                                </div>
                            @enderror
                        </div>
                    </div>

                    {{-- Address --}}
                    <div>
                        <label for="address" class="block text-sm font-medium text-gray-300 mb-1.5">
                            អាសយដ្ឋាន <span class="text-gray-500 font-normal">(ស្រេចចិត្ត)</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-3 material-icons-round text-gray-500 text-[18px]">home</span>
                            <textarea id="address" name="address" rows="2"
                                      placeholder="ភូមិ/សង្កាត់/ខណ្ឌ/ក្រុង/ខេត្ត"
                                      class="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 text-white
                                             placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all
                                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none">{{ old('address') }}</textarea>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Card: Guardian Info --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-800/30">
                    <span class="material-icons-round text-brand-400 text-[18px]">family_restroom</span>
                    <h3 class="font-semibold text-white text-sm">ព័ត៌មានអ្នកឃ្វាល</h3>
                    {{-- Public search key indicator --}}
                    <span class="ml-auto inline-flex items-center gap-1 bg-amber-950/50 border border-amber-800/40
                                 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        <span class="material-icons-round text-[10px]">public</span>
                        កូនសោស្វែងរកសាធារណៈ
                    </span>
                </div>
                <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label for="guardian_name" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ឈ្មោះអ្នកឃ្វាល <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">supervisor_account</span>
                            <input type="text" id="guardian_name" name="guardian_name"
                                   value="{{ old('guardian_name') }}" placeholder="ឧ. លោក ចន្ទ ស"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('guardian_name') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                        </div>
                        @error('guardian_name')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>
                    <div>
                        <label for="guardian_phone" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ទូរស័ព្ទអ្នកឃ្វាល <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-amber-500 text-[18px]">phone</span>
                            <input type="tel" id="guardian_phone" name="guardian_phone"
                                   value="{{ old('guardian_phone') }}" placeholder="ឧ. 012 345 678"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm font-mono transition-all
                                          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                          {{ $errors->has('guardian_phone') ? 'border-red-500/60 bg-red-950/10' : 'border-amber-800/30 hover:border-amber-700/50' }}">
                        </div>
                        @error('guardian_phone')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                            </div>
                        @enderror
                        <p class="flex items-center gap-1 mt-1.5 text-amber-600/70 text-[11px]">
                            <span class="material-icons-round text-[11px]">info</span>
                            លេខនេះត្រូវបានប្រើដោយ React Public Website សម្រាប់ការផ្ទៀងផ្ទាត់
                        </p>
                    </div>
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ទូរស័ព្ទផ្ទាល់ខ្លួន <span class="text-gray-500 font-normal">(ស្រេចចិត្ត)</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">smartphone</span>
                            <input type="tel" id="phone" name="phone"
                                   value="{{ old('phone') }}" placeholder="ឧ. 098 765 432"
                                   class="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 text-white
                                          placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {{-- ════════════════════════════════════════
             RIGHT (1/3): Enrollment + Account
        ════════════════════════════════════════ --}}
        <div class="lg:col-span-1 space-y-5">

            {{-- Enrollment Card --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-800
                            bg-gradient-to-r from-emerald-950/40 to-gray-800/30">
                    <span class="material-icons-round text-emerald-400 text-[18px]">assignment_ind</span>
                    <div>
                        <h3 class="font-semibold text-white text-sm">ការចុះឈ្មោះចូលរៀន</h3>
                        <p class="text-[10px] text-emerald-400/70 font-mono">Enrollment</p>
                    </div>
                </div>
                <div class="p-5 space-y-4">

                    {{-- Group classrooms by academic year --}}
                    <div>
                        <label for="classroom_id" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ថ្នាក់រៀន <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">meeting_room</span>
                            <select id="classroom_id" name="classroom_id"
                                    class="w-full appearance-none bg-gray-800 border text-sm rounded-xl
                                           pl-10 pr-9 py-2.5 transition-all text-white
                                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                           {{ $errors->has('classroom_id') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                                <option value="" disabled {{ old('classroom_id') ? '' : 'selected' }}>— ជ្រើសរើសថ្នាក់ —</option>
                                @php
                                    $grouped = $classrooms->groupBy(fn($c) => $c->academicYear?->name ?? 'មិនមានឆ្នាំ');
                                @endphp
                                @foreach($grouped as $yearName => $yearClassrooms)
                                    <optgroup label="📅 {{ $yearName }}">
                                        @foreach($yearClassrooms as $classroom)
                                            <option value="{{ $classroom->id }}"
                                                    {{ old('classroom_id') == $classroom->id ? 'selected' : '' }}>
                                                {{ $classroom->name }}
                                                (ថ្នាក់ទី {{ $classroom->grade?->level }}
                                                — @if($classroom->track === 'science') វិទ្យា
                                                  @elseif($classroom->track === 'social_science') សង្គម
                                                  @else ទូទៅ @endif)
                                            </option>
                                        @endforeach
                                    </optgroup>
                                @endforeach
                            </select>
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px] pointer-events-none">expand_more</span>
                        </div>
                        @error('classroom_id')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Enrollment info note --}}
                    <div class="flex items-start gap-2 bg-emerald-950/20 border border-emerald-800/30 rounded-xl px-3 py-3">
                        <span class="material-icons-round text-emerald-400 text-[14px] flex-shrink-0 mt-0.5">info</span>
                        <p class="text-[11px] text-emerald-300/70 leading-relaxed">
                            សិស្សនឹងត្រូវបានចុះឈ្មោះជា
                            <span class="font-semibold text-emerald-300">«សកម្ម»</span>
                            ភ្លាមៗ។ ស្ថានភាពអាចផ្លាស់ប្ដូរ (ផ្ទេរ/បោះបង់) ពី​ System ក្រោយ។
                        </p>
                    </div>
                </div>
            </div>

            {{-- Student Portal Account (Optional) --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-800/30">
                    <span class="material-icons-round text-gray-400 text-[18px]">lock_person</span>
                    <div>
                        <h3 class="font-semibold text-white text-sm">គណនីចូលប្រព័ន្ធ</h3>
                        <p class="text-[10px] text-gray-500 font-mono">Student Portal (Optional)</p>
                    </div>
                </div>
                <div class="p-5 space-y-4">
                    <div class="flex items-start gap-2 bg-sky-950/20 border border-sky-800/30 rounded-xl px-3 py-3">
                        <span class="material-icons-round text-sky-400 text-[14px] flex-shrink-0 mt-0.5">tips_and_updates</span>
                        <p class="text-[11px] text-sky-300/70 leading-relaxed">
                            Email & Password គ្រាន់តែ
                            <span class="font-semibold text-sky-200">ស្រេចចិត្ត</span>
                            — ទុកទទេបើសិស្សមិនត្រូវការ Portal ។
                            ប្រសិនទុកទទេ, ការផ្ទៀងផ្ទាត់នឹងប្រើ
                            <span class="font-semibold text-sky-200">Student ID + ទូរស័ព្ទអ្នកឃ្វាល</span>
                            តែប៉ុណ្ណោះ។
                        </p>
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-300 mb-1.5">
                            អ៊ីម៉ែល <span class="text-gray-500 font-normal">(ស្រេចចិត្ត)</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">email</span>
                            <input type="email" id="email" name="email"
                                   value="{{ old('email') }}" placeholder="student@school.edu.kh"
                                   autocomplete="off"
                                   class="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 text-white
                                          placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('email') ? 'border-red-500/60 bg-red-950/10' : '' }}">
                        </div>
                        @error('email')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>
                </div>
            </div>

            {{-- Sticky Submit --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3 lg:sticky lg:top-24">
                <button type="submit"
                        id="btn-submit-student"
                        class="w-full inline-flex items-center justify-center gap-2
                               bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                               text-white font-semibold text-sm px-6 py-3 rounded-xl
                               transition-all shadow-lg shadow-brand-600/20
                               disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-icons-round text-[18px]">how_to_reg</span>
                    ចុះឈ្មោះសិស្ស
                </button>
                <a href="{{ route('admin.students.index') }}"
                   class="w-full inline-flex items-center justify-center gap-2
                          bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                          text-gray-300 hover:text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all">
                    <span class="material-icons-round text-[18px]">arrow_back</span>
                    បោះបង់
                </a>
            </div>

        </div>
    </div>
</form>

@endsection

@push('scripts')
<script>
    document.getElementById('form-create-student').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-student');
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            កំពុងចុះឈ្មោះ…
        `;
    });
</script>
@endpush
