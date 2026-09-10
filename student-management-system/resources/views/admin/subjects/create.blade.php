@extends('layouts.admin')

@section('title', 'បន្ថែមមុខវិជ្ជា')
@section('page-title', 'បន្ថែមមុខវិជ្ជា')
@section('breadcrumb')
    <a href="{{ route('admin.subjects.index') }}" class="hover:text-gray-300">មុខវិជ្ជា</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">បន្ថែមថ្មី</span>
@endsection

@section('content')

<div class="max-w-2xl mx-auto">
    <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

        {{-- Card Header --}}
        <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-800 bg-gray-800/30">
            <div class="w-11 h-11 bg-brand-950/80 border border-brand-800/50 rounded-xl
                        flex items-center justify-center flex-shrink-0">
                <span class="material-icons-round text-brand-400 text-[22px]">menu_book</span>
            </div>
            <div>
                <h2 class="font-semibold text-white">ព័ត៌មានមុខវិជ្ជា</h2>
                <p class="text-xs text-gray-400 mt-0.5">
                    បំពេញព័ត៌មានខាងក្រោម ដើម្បីបន្ថែមមុខវិជ្ជាថ្មី
                </p>
            </div>
        </div>

        <form method="POST"
              action="{{ route('admin.subjects.store') }}"
              id="form-create-subject"
              class="p-6 space-y-5">
            @csrf

            {{-- ── Section: Subject Info ── --}}
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="material-icons-round text-brand-400 text-[18px]">info</span>
                    <h3 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ព័ត៌មានមុខវិជ្ជា</h3>
                </div>

                <div class="space-y-5">

                    {{-- Subject Code --}}
                    <div>
                        <label for="code" class="block text-sm font-medium text-gray-300 mb-1.5">
                            លេខកូដ <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">tag</span>
                            <input type="text"
                                   id="code"
                                   name="code"
                                   value="{{ old('code') }}"
                                   placeholder="ឧ. MATH-101"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm font-mono transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('code') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                        </div>
                        @error('code')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span>
                                <span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Name Khmer --}}
                    <div>
                        <label for="name_kh" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ឈ្មោះ (ភាសាខ្មែរ) <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">translate</span>
                            <input type="text"
                                   id="name_kh"
                                   name="name_kh"
                                   value="{{ old('name_kh') }}"
                                   placeholder="ឧ. គណិតវិទ្យា"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('name_kh') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                        </div>
                        @error('name_kh')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span>
                                <span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Name English --}}
                    <div>
                        <label for="name_en" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ឈ្មោះ (អក្សរលោក) <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">spellcheck</span>
                            <input type="text"
                                   id="name_en"
                                   name="name_en"
                                   value="{{ old('name_en') }}"
                                   placeholder="ឧ. Mathematics"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('name_en') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                        </div>
                        @error('name_en')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span>
                                <span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                </div>
            </div>

            {{-- Divider --}}
            <div class="border-t border-gray-800"></div>

            {{-- ── Track Info ── --}}
            <div>
                <div class="flex items-center gap-2 mb-3">
                    <span class="material-icons-round text-brand-400 text-[18px]">fork_right</span>
                    <h3 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ផ្លូវវិជ្ជា (Track)</h3>
                </div>

                {{-- Visual track selector --}}
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3" id="track-selector">

                    {{-- Science Track --}}
                    <label for="track_science"
                           class="relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer
                                  transition-all duration-150 group
                                  has-[:checked]:border-teal-500 has-[:checked]:bg-teal-950/30
                                  border-gray-700 hover:border-gray-600 hover:bg-gray-800/50">
                        <input type="radio" id="track_science" name="track_preview"
                               value="science" class="sr-only" {{ old('track_preview') === 'science' ? 'checked' : '' }}>
                        <div class="w-10 h-10 bg-teal-950/60 border border-teal-800/50 rounded-xl
                                    flex items-center justify-center group-has-[:checked]:bg-teal-800/50">
                            <span class="material-icons-round text-teal-400 text-[20px]">science</span>
                        </div>
                        <div class="text-center">
                            <p class="text-sm font-semibold text-white">វិទ្យាសាស្ត្រពិត</p>
                            <p class="text-xs text-gray-500 mt-0.5">Science Track</p>
                        </div>
                        <span class="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-gray-600
                                     group-has-[:checked]:border-teal-400 group-has-[:checked]:bg-teal-400
                                     flex items-center justify-center transition-all">
                            <span class="material-icons-round text-gray-900 text-[10px] opacity-0
                                         group-has-[:checked]:opacity-100">check</span>
                        </span>
                    </label>

                    {{-- Social Science Track --}}
                    <label for="track_social"
                           class="relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer
                                  transition-all duration-150 group
                                  has-[:checked]:border-amber-500 has-[:checked]:bg-amber-950/30
                                  border-gray-700 hover:border-gray-600 hover:bg-gray-800/50">
                        <input type="radio" id="track_social" name="track_preview"
                               value="social_science" class="sr-only" {{ old('track_preview') === 'social_science' ? 'checked' : '' }}>
                        <div class="w-10 h-10 bg-amber-950/60 border border-amber-800/50 rounded-xl
                                    flex items-center justify-center group-has-[:checked]:bg-amber-800/50">
                            <span class="material-icons-round text-amber-400 text-[20px]">account_balance</span>
                        </div>
                        <div class="text-center">
                            <p class="text-sm font-semibold text-white">វិទ្យាសាស្ត្រសង្គម</p>
                            <p class="text-xs text-gray-500 mt-0.5">Social Science</p>
                        </div>
                        <span class="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-gray-600
                                     group-has-[:checked]:border-amber-400 group-has-[:checked]:bg-amber-400
                                     flex items-center justify-center transition-all">
                            <span class="material-icons-round text-gray-900 text-[10px] opacity-0
                                         group-has-[:checked]:opacity-100">check</span>
                        </span>
                    </label>

                    {{-- General --}}
                    <label for="track_general"
                           class="relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer
                                  transition-all duration-150 group
                                  has-[:checked]:border-sky-500 has-[:checked]:bg-sky-950/30
                                  border-gray-700 hover:border-gray-600 hover:bg-gray-800/50">
                        <input type="radio" id="track_general" name="track_preview"
                               value="general" class="sr-only" {{ old('track_preview', 'general') === 'general' ? 'checked' : '' }}>
                        <div class="w-10 h-10 bg-sky-950/60 border border-sky-800/50 rounded-xl
                                    flex items-center justify-center group-has-[:checked]:bg-sky-800/50">
                            <span class="material-icons-round text-sky-400 text-[20px]">menu_book</span>
                        </div>
                        <div class="text-center">
                            <p class="text-sm font-semibold text-white">ទូទៅ</p>
                            <p class="text-xs text-gray-500 mt-0.5">General (ថ្នាក់ទី ១០)</p>
                        </div>
                        <span class="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-gray-600
                                     group-has-[:checked]:border-sky-400 group-has-[:checked]:bg-sky-400
                                     flex items-center justify-center transition-all">
                            <span class="material-icons-round text-gray-900 text-[10px] opacity-0
                                         group-has-[:checked]:opacity-100">check</span>
                        </span>
                    </label>

                </div>

                {{-- Track context note --}}
                <div class="mt-3 flex items-start gap-2 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3">
                    <span class="material-icons-round text-sky-400 text-[16px] flex-shrink-0 mt-0.5">tips_and_updates</span>
                    <p class="text-xs text-gray-400 leading-relaxed">
                        ការជ្រើសរើស Track នៅទីនេះ គ្រាន់តែជាការបង្ហាញ​ ។
                        ការចាត់តាំង Track ពិតប្រាកដ (ចំពោះ Grade ជាក់លាក់)
                        ត្រូវធ្វើនៅទំព័រ <span class="text-white font-medium">កែប្រែ</span>
                        បន្ទាប់ពីបង្កើតមុខវិជ្ជា។
                    </p>
                </div>
            </div>

            {{-- Divider --}}
            <div class="border-t border-gray-800"></div>

            {{-- Actions --}}
            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-1">
                <a href="{{ route('admin.subjects.index') }}"
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                          bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                          text-gray-300 hover:text-white font-medium text-sm
                          px-5 py-2.5 rounded-xl transition-all duration-150">
                    <span class="material-icons-round text-[18px]">arrow_back</span>
                    បោះបង់
                </a>
                <button type="submit"
                        id="btn-submit-subject"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                               bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                               text-white font-semibold text-sm
                               px-6 py-2.5 rounded-xl transition-all duration-150
                               shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុកមុខវិជ្ជា
                </button>
            </div>

        </form>
    </div>
</div>

@endsection

@push('scripts')
<script>
    document.getElementById('form-create-subject').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-subject');
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
