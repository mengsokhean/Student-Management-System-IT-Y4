@extends('layouts.admin')

@section('title', 'បន្ថែមគ្រូបង្រៀន')
@section('page-title', 'បន្ថែមគ្រូបង្រៀន')
@section('breadcrumb')
    <a href="{{ route('admin.teachers.index') }}" class="hover:text-gray-300">គ្រូបង្រៀន</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">បន្ថែមថ្មី</span>
@endsection

@section('content')

<div class="max-w-3xl mx-auto">

    {{-- ── Page Card ── --}}
    <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

        {{-- Card Header --}}
        <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-800 bg-gray-800/30">
            <div class="w-11 h-11 bg-brand-950/80 border border-brand-800/50 rounded-xl
                        flex items-center justify-center flex-shrink-0">
                <span class="material-icons-round text-brand-400 text-[22px]">person_add</span>
            </div>
            <div>
                <h2 class="font-semibold text-white">ព័ត៌មានគ្រូបង្រៀន</h2>
                <p class="text-xs text-gray-400 mt-0.5">
                    បំពេញព័ត៌មានខាងក្រោម ដើម្បីចុះឈ្មោះគ្រូបង្រៀនថ្មី
                </p>
            </div>
        </div>

        {{-- ── Form ── --}}
        <form method="POST"
              action="{{ route('admin.teachers.store') }}"
              id="form-create-teacher"
              class="p-6 space-y-6">
            @csrf

            {{-- ── Section: Profile Information ── --}}
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="material-icons-round text-brand-400 text-[18px]">info</span>
                    <h3 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {{-- Teacher Code --}}
                    <div class="sm:col-span-1">
                        <label for="teacher_code" class="block text-sm font-medium text-gray-300 mb-1.5">
                            អត្តលេខ <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">badge</span>
                            <input type="text"
                                   id="teacher_code"
                                   name="teacher_code"
                                   value="{{ old('teacher_code') }}"
                                   placeholder="10156789"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('teacher_code') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                        </div>
                        @error('teacher_code')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span>
                                <span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Gender --}}
                    <div class="sm:col-span-1">
                        <label for="gender" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ភេទ <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">wc</span>
                            <select id="gender"
                                    name="gender"
                                    class="w-full appearance-none bg-gray-800 border text-sm rounded-xl
                                           pl-10 pr-9 py-2.5 transition-all duration-150 text-white
                                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                           {{ $errors->has('gender') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                                <option value="" disabled {{ old('gender') ? '' : 'selected' }} class="text-gray-500">— ជ្រើសរើសភេទ —</option>
                                <option value="male"   {{ old('gender') === 'male'   ? 'selected' : '' }}>ប្រុស</option>
                                <option value="female" {{ old('gender') === 'female' ? 'selected' : '' }}>ស្រី</option>
                            </select>
                            <span class="absolute right-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px] pointer-events-none">expand_more</span>
                        </div>
                        @error('gender')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span>
                                <span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Name Khmer --}}
                    <div class="sm:col-span-1">
                        <label for="name_kh" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ឈ្មោះ (ភាសាខ្មែរ) <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">person</span>
                            <input type="text"
                                   id="name_kh"
                                   name="name_kh"
                                   value="{{ old('name_kh') }}"
                                   placeholder="ឧ. សុខ ចន្ទ"
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

                    {{-- Name Latin --}}
                    <div class="sm:col-span-1">
                        <label for="name_en" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ឈ្មោះ (អក្សរលោក) <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">person_outline</span>
                            <input type="text"
                                   id="name_en"
                                   name="name_en"
                                   value="{{ old('name_en') }}"
                                   placeholder="ឧ. Sok Chan"
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

                    {{-- Phone --}}
                    <div class="sm:col-span-2">
                        <label for="phone" class="block text-sm font-medium text-gray-300 mb-1.5">
                            លេខទូរស័ព្ទ
                            <span class="text-gray-500 font-normal">(ស្រេចចិត្ត)</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">phone</span>
                            <input type="tel"
                                   id="phone"
                                   name="phone"
                                   value="{{ old('phone') }}"
                                   placeholder="ឧ. 012 345 678"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          border-gray-700 hover:border-gray-600
                                          {{ $errors->has('phone') ? 'border-red-500/60 bg-red-950/10' : '' }}">
                        </div>
                        @error('phone')
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

            {{-- ── Section: Login Account ── --}}
            <div>
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="material-icons-round text-brand-400 text-[18px]">lock</span>
                    <h3 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">គណនីចូលប្រព័ន្ធ</h3>
                </div>
                <p class="text-xs text-gray-500 mb-4 pl-6">
                    គ្រូនឹងប្រើ Email និង Password នេះ ដើម្បីចូលទៅកាន់ Teacher Portal
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {{-- Email --}}
                    <div class="sm:col-span-2">
                        <label for="email" class="block text-sm font-medium text-gray-300 mb-1.5">
                            អ៊ីម៉ែល <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">email</span>
                            <input type="email"
                                   id="email"
                                   name="email"
                                   value="{{ old('email') }}"
                                   placeholder="ឧ. teacher@school.edu.kh"
                                   autocomplete="off"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('email') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                        </div>
                        @error('email')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span>
                                <span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Password --}}
                    <div class="sm:col-span-1">
                        <label for="password" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ពាក្យសម្ងាត់ <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">lock_outline</span>
                            <input type="password"
                                   id="password"
                                   name="password"
                                   placeholder="យ៉ាងហោចណាស់ ៦ តួ"
                                   autocomplete="new-password"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-10 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('password') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                            {{-- Toggle visibility --}}
                            <button type="button"
                                    onclick="togglePassword('password', 'pwd-eye')"
                                    class="absolute right-3 top-1/2 -translate-y-1/2
                                           text-gray-500 hover:text-gray-300 transition-colors">
                                <span id="pwd-eye" class="material-icons-round text-[18px]">visibility_off</span>
                            </button>
                        </div>
                        @error('password')
                            <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                                <span class="material-icons-round text-[14px]">error_outline</span>
                                <span>{{ $message }}</span>
                            </div>
                        @enderror
                    </div>

                    {{-- Password Confirmation --}}
                    <div class="sm:col-span-1">
                        <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-1.5">
                            បញ្ជាក់ពាក្យសម្ងាត់ <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">lock</span>
                            <input type="password"
                                   id="password_confirmation"
                                   name="password_confirmation"
                                   placeholder="បញ្ចូលម្ដងទៀត"
                                   autocomplete="new-password"
                                   class="w-full bg-gray-800 border border-gray-700 hover:border-gray-600
                                          text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-10 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                            <button type="button"
                                    onclick="togglePassword('password_confirmation', 'pwd-confirm-eye')"
                                    class="absolute right-3 top-1/2 -translate-y-1/2
                                           text-gray-500 hover:text-gray-300 transition-colors">
                                <span id="pwd-confirm-eye" class="material-icons-round text-[18px]">visibility_off</span>
                            </button>
                        </div>
                    </div>

                    {{-- Password strength hint --}}
                    <div class="sm:col-span-2">
                        <div class="flex items-start gap-2 bg-gray-800/50 border border-gray-700/50
                                    rounded-xl px-4 py-3">
                            <span class="material-icons-round text-amber-400 text-[16px] flex-shrink-0 mt-0.5">info</span>
                            <p class="text-xs text-gray-400 leading-relaxed">
                                ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ <span class="text-white font-medium">៦ តួ</span>
                                ហើយគ្រូអាចផ្លាស់ប្ដូរបន្ទាប់ពីចូលប្រព័ន្ធ។
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Divider --}}
            <div class="border-t border-gray-800"></div>

            {{-- ── Form Actions ── --}}
            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-1">
                <a href="{{ route('admin.teachers.index') }}"
                   id="btn-cancel-create-teacher"
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                          bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                          text-gray-300 hover:text-white font-medium text-sm
                          px-5 py-2.5 rounded-xl transition-all duration-150">
                    <span class="material-icons-round text-[18px]">arrow_back</span>
                    បោះបង់
                </a>

                <button type="submit"
                        id="btn-submit-create-teacher"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                               bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                               text-white font-semibold text-sm
                               px-6 py-2.5 rounded-xl transition-all duration-150
                               shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30
                               disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុកគ្រូបង្រៀន
                </button>
            </div>

        </form>
    </div>
</div>

@endsection

@push('scripts')
<script>
    // Toggle password visibility
    function togglePassword(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon  = document.getElementById(iconId);
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility_off';
        }
    }

    // Disable submit button on form submit to prevent double-clicks
    document.getElementById('form-create-teacher').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-create-teacher');
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            កំពុងរក្សាទុក…
        `;
    });

    // Live password match indicator
    const pwdInput    = document.getElementById('password');
    const pwdConfirm  = document.getElementById('password_confirmation');
    pwdConfirm.addEventListener('input', function () {
        if (pwdConfirm.value && pwdInput.value !== pwdConfirm.value) {
            pwdConfirm.classList.add('border-red-500/60', 'bg-red-950/10');
            pwdConfirm.classList.remove('border-gray-700');
        } else {
            pwdConfirm.classList.remove('border-red-500/60', 'bg-red-950/10');
            pwdConfirm.classList.add('border-gray-700');
        }
    });
</script>
@endpush
