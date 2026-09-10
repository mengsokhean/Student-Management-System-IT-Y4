@extends('layouts.admin')

@section('title', 'កែប្រែ — ' . $student->name_en)
@section('page-title', 'កែប្រែព័ត៌មានសិស្ស')
@section('breadcrumb')
    <a href="{{ route('admin.students.index') }}" class="hover:text-gray-300">សិស្ស</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">{{ $student->name_en }}</span>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">កែប្រែ</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.students.show', $student) }}"
       class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700
              hover:border-gray-600 text-gray-300 hover:text-white text-sm font-medium
              px-4 py-2 rounded-xl transition-all">
        <span class="material-icons-round text-[18px]">visibility</span>
        <span>មើលប្រវត្តិរូប</span>
    </a>
@endsection

@section('content')

<div class="max-w-3xl mx-auto">

    {{-- Identity Banner --}}
    <div class="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 mb-5">
        <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center
                    {{ $student->gender === 'female'
                        ? 'bg-pink-950/70 border border-pink-700/50'
                        : 'bg-sky-950/70 border border-sky-700/50' }}">
            <span class="material-icons-round text-[24px] {{ $student->gender === 'female' ? 'text-pink-400' : 'text-sky-400' }}">
                {{ $student->gender === 'female' ? 'face_3' : 'face' }}
            </span>
        </div>
        <div class="flex-1 min-w-0">
            <p class="font-bold text-white text-base">{{ $student->name_kh }}</p>
            <p class="text-xs text-gray-400">{{ $student->name_en }}</p>
        </div>
        <span class="inline-flex items-center gap-1.5 bg-rose-950/50 border border-rose-800/40
                     text-rose-400 font-mono text-xs px-2.5 py-1.5 rounded-xl flex-shrink-0">
            <span class="material-icons-round text-[14px]">badge</span>
            {{ $student->student_code }}
        </span>
    </div>

    <form method="POST"
          action="{{ route('admin.students.update', $student) }}"
          id="form-edit-student">
        @csrf
        @method('PUT')

        <div class="space-y-5">

            {{-- Personal Info Card --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-800/30">
                    <span class="material-icons-round text-brand-400 text-[18px]">person</span>
                    <h2 class="font-semibold text-white text-sm">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
                    <span class="ml-auto inline-flex items-center gap-1 bg-gray-800 border border-gray-700
                                 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                        <span class="material-icons-round text-[10px]">lock</span>
                        Student ID មិនអាចផ្លាស់ប្ដូរ
                    </span>
                </div>
                <div class="p-6 space-y-5">

                    {{-- Names --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label for="name_kh" class="block text-sm font-medium text-gray-300 mb-1.5">
                                ឈ្មោះ (ភាសាខ្មែរ) <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">person</span>
                                <input type="text" id="name_kh" name="name_kh"
                                       value="{{ old('name_kh', $student->name_kh) }}"
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
                                       value="{{ old('name_en', $student->name_en) }}"
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

                    {{-- Gender + DOB --}}
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
                                    <option value="male"   {{ old('gender', $student->gender) === 'male'   ? 'selected' : '' }}>ប្រុស</option>
                                    <option value="female" {{ old('gender', $student->gender) === 'female' ? 'selected' : '' }}>ស្រី</option>
                                </select>
                                <span class="absolute right-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px] pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        <div>
                            <label for="date_of_birth" class="block text-sm font-medium text-gray-300 mb-1.5">
                                ថ្ងៃខែឆ្នាំកំណើត <span class="text-red-400">*</span>
                            </label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">cake</span>
                                <input type="date" id="date_of_birth" name="date_of_birth"
                                       value="{{ old('date_of_birth', $student->date_of_birth) }}"
                                       class="w-full bg-gray-800 border text-white rounded-xl pl-10 pr-4 py-2.5 text-sm
                                              transition-all [color-scheme:dark] focus:outline-none focus:ring-2
                                              focus:ring-brand-500 focus:border-transparent
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
                                      class="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 text-white
                                             placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all
                                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none">{{ old('address', $student->address) }}</textarea>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Guardian Info Card --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-800/30">
                    <span class="material-icons-round text-brand-400 text-[18px]">family_restroom</span>
                    <h3 class="font-semibold text-white text-sm">ព័ត៌មានអ្នកឃ្វាល</h3>
                    <span class="ml-auto inline-flex items-center gap-1 bg-amber-950/50 border border-amber-800/40
                                 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        <span class="material-icons-round text-[10px]">public</span>
                        កូនសោស្វែងរក
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
                                   value="{{ old('guardian_name', $student->guardian_name) }}"
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
                                   value="{{ old('guardian_phone', $student->guardian_phone) }}"
                                   class="w-full bg-gray-800 border text-white font-mono rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all
                                          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                                          {{ $errors->has('guardian_phone') ? 'border-red-500/60 bg-red-950/10' : 'border-amber-800/30 hover:border-amber-700/50' }}">
                        </div>
                        @error('guardian_phone')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ទូរស័ព្ទផ្ទាល់ខ្លួន <span class="text-gray-500 font-normal">(ស្រេចចិត្ត)</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500 text-[18px]">smartphone</span>
                            <input type="tel" id="phone" name="phone"
                                   value="{{ old('phone', $student->phone) }}"
                                   class="w-full bg-gray-800 border border-gray-700 hover:border-gray-600 text-white
                                          rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                        </div>
                    </div>
                </div>
            </div>

            {{-- Enrollment lock notice --}}
            <div class="flex items-start gap-3 bg-amber-950/20 border border-amber-800/30 rounded-2xl px-5 py-4">
                <span class="material-icons-round text-amber-400 text-[20px] flex-shrink-0 mt-0.5">lock</span>
                <div>
                    <p class="text-sm font-semibold text-amber-300">ការចុះឈ្មោះ & ថ្នាក់រៀនមិនផ្លាស់ប្ដូរនៅទីនេះ</p>
                    <p class="text-xs text-amber-300/60 mt-0.5 leading-relaxed">
                        ការផ្លាស់ប្ដូរថ្នាក់ (ការស្ទួន/ការបញ្ចប់) ធ្វើតាម
                        Enrollment Management ដែលផ្ដល់ Audit Trail ពេញលេញ។
                    </p>
                </div>
            </div>

            {{-- Actions --}}
            <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button type="button"
                        onclick="openDeleteModal(
                            '{{ route('admin.students.destroy', $student) }}',
                            'តើអ្នកពិតជាចង់លុបសិស្ស {{ addslashes($student->name_en) }} ({{ addslashes($student->student_code) }}) មែនទេ?'
                        )"
                        class="inline-flex items-center gap-2 bg-red-950/30 hover:bg-red-950/60
                               border border-red-800/40 hover:border-red-700/60
                               text-red-400 hover:text-red-300 font-medium text-sm
                               px-4 py-2.5 rounded-xl transition-all">
                    <span class="material-icons-round text-[18px]">delete</span>
                    លុបសិស្ស
                </button>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <a href="{{ route('admin.students.show', $student) }}"
                       class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                              bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                              text-gray-300 hover:text-white font-medium text-sm
                              px-5 py-2.5 rounded-xl transition-all">
                        <span class="material-icons-round text-[18px]">close</span>
                        បោះបង់
                    </a>
                    <button type="submit"
                            id="btn-submit-edit-student"
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                                   bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm
                                   px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-600/20
                                   disabled:opacity-50 disabled:cursor-not-allowed">
                        <span class="material-icons-round text-[18px]">save</span>
                        រក្សាទុក
                    </button>
                </div>
            </div>

        </div>
    </form>
</div>

@endsection

@push('scripts')
<script>
    document.getElementById('form-edit-student').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-edit-student');
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
