@extends('layouts.admin')

@section('title', 'កែប្រែ — ' . $teacher->name_en)
@section('page-title', 'កែប្រែគ្រូបង្រៀន')
@section('breadcrumb')
    <a href="{{ route('admin.teachers.index') }}" class="hover:text-gray-300">គ្រូបង្រៀន</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <a href="{{ route('admin.teachers.show', $teacher) }}" class="hover:text-gray-300">{{ $teacher->name_en }}</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">កែប្រែ</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.teachers.show', $teacher) }}"
       class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700
              hover:border-gray-600 text-gray-300 hover:text-white text-sm font-medium
              px-4 py-2 rounded-xl transition-all duration-150">
        <span class="material-icons-round text-[18px]">visibility</span>
        <span>មើលប្រវត្តិរូប</span>
    </a>
@endsection

@section('content')

<div class="max-w-3xl mx-auto">
    <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

        {{-- Card Header — Shows current teacher identity --}}
        <div class="flex items-center gap-4 px-6 py-5 border-b border-gray-800 bg-gray-800/30">
            {{-- Gender-coded avatar --}}
            <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center
                        {{ $teacher->gender === 'female' ? 'bg-pink-950/70 border border-pink-800/40' : 'bg-sky-950/70 border border-sky-800/40' }}">
                <span class="material-icons-round text-[24px]
                             {{ $teacher->gender === 'female' ? 'text-pink-400' : 'text-sky-400' }}">
                    {{ $teacher->gender === 'female' ? 'face_3' : 'face' }}
                </span>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                    <h2 class="font-semibold text-white">{{ $teacher->name_kh }}</h2>
                    <span class="text-gray-500 text-sm">·</span>
                    <span class="font-mono text-amber-400 text-xs bg-amber-950/50 border border-amber-800/40
                                 px-2 py-0.5 rounded-lg">{{ $teacher->teacher_code }}</span>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">{{ $teacher->name_en }}</p>
            </div>
            <span class="material-icons-round text-brand-500 text-[20px] flex-shrink-0">edit</span>
        </div>

        {{-- ── Form ── --}}
        <form method="POST"
              action="{{ route('admin.teachers.update', $teacher) }}"
              id="form-edit-teacher"
              class="p-6 space-y-6">
            @csrf
            @method('PUT')

            {{-- ── Section: Profile Information ── --}}
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="material-icons-round text-brand-400 text-[18px]">info</span>
                    <h3 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {{-- Teacher Code (read-only — changing codes breaks references) --}}
                    <div class="sm:col-span-1">
                        <label for="teacher_code" class="block text-sm font-medium text-gray-300 mb-1.5">
                            អត្តលេខ
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-600 text-[18px]">badge</span>
                            <input type="text"
                                   id="teacher_code"
                                   value="{{ $teacher->teacher_code }}"
                                   readonly
                                   class="w-full bg-gray-800/50 border border-gray-700/50 text-gray-500
                                          rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed select-none">
                        </div>
                        <p class="flex items-center gap-1 mt-1.5 text-gray-600 text-xs">
                            <span class="material-icons-round text-[12px]">lock</span>
                            អត្តលេខមិនអាចផ្លាស់ប្ដូរបានទេ
                        </p>
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
                                <option value="male"   {{ old('gender', $teacher->gender) === 'male'   ? 'selected' : '' }}>ប្រុស</option>
                                <option value="female" {{ old('gender', $teacher->gender) === 'female' ? 'selected' : '' }}>ស្រី</option>
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
                                   value="{{ old('name_kh', $teacher->name_kh) }}"
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
                                   value="{{ old('name_en', $teacher->name_en) }}"
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
                                   value="{{ old('phone', $teacher->phone) }}"
                                   placeholder="ឧ. 012 345 678"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('phone') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
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
                    Email ត្រូវបានចងទៅនឹងគណនីហើយ។ ទុក Password ទទេ ប្រសិនបើមិនចង់ផ្លាស់ប្ដូរ។
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {{-- Email (read-only — changing email is a separate security action) --}}
                    <div class="sm:col-span-2">
                        <label for="email" class="block text-sm font-medium text-gray-300 mb-1.5">
                            អ៊ីម៉ែល
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-600 text-[18px]">email</span>
                            <input type="email"
                                   id="email"
                                   value="{{ $teacher->user?->email ?? '—' }}"
                                   readonly
                                   class="w-full bg-gray-800/50 border border-gray-700/50 text-gray-500
                                          rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed select-none">
                        </div>
                        <p class="flex items-center gap-1 mt-1.5 text-gray-600 text-xs">
                            <span class="material-icons-round text-[12px]">lock</span>
                            ដើម្បីផ្លាស់ប្ដូរ Email សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ
                        </p>
                    </div>

                    {{-- New Password (optional) --}}
                    <div class="sm:col-span-1">
                        <label for="password" class="block text-sm font-medium text-gray-300 mb-1.5">
                            ពាក្យសម្ងាត់ថ្មី
                            <span class="text-gray-500 font-normal">(ស្រេចចិត្ត)</span>
                        </label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2
                                         material-icons-round text-gray-500 text-[18px]">lock_outline</span>
                            <input type="password"
                                   id="password"
                                   name="password"
                                   placeholder="ទុកទទេ ប្រសិនមិនផ្លាស់ប្ដូរ"
                                   autocomplete="new-password"
                                   class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                          pl-10 pr-10 py-2.5 text-sm transition-all duration-150
                                          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                          {{ $errors->has('password') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
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

                    {{-- Confirm New Password --}}
                    <div class="sm:col-span-1">
                        <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-1.5">
                            បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
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

                    {{-- Optional password hint --}}
                    <div class="sm:col-span-2">
                        <div class="flex items-start gap-2 bg-amber-950/20 border border-amber-800/30
                                    rounded-xl px-4 py-3">
                            <span class="material-icons-round text-amber-500 text-[16px] flex-shrink-0 mt-0.5">tips_and_updates</span>
                            <p class="text-xs text-amber-200/70 leading-relaxed">
                                <span class="font-medium text-amber-300">ទុកចន្លោះ Password ទទេ</span>
                                ប្រសិនបើអ្នកមិនចង់ផ្លាស់ប្ដូរពាក្យសម្ងាត់បច្ចុប្បន្ន។
                                ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ <span class="font-medium text-amber-300">៦ តួ</span>
                                ហើយបញ្ជាក់ត្រូវគ្នា។
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Divider --}}
            <div class="border-t border-gray-800"></div>

            {{-- ── Form Actions ── --}}
            <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-1">

                {{-- Left: danger zone --}}
                <button type="button"
                        onclick="openDeleteModal(
                            '{{ route('admin.teachers.destroy', $teacher) }}',
                            'តើអ្នកពិតជាចង់លុប {{ addslashes($teacher->name_en) }} ({{ addslashes($teacher->teacher_code) }}) មែនទេ?'
                        )"
                        class="inline-flex items-center gap-2 bg-red-950/30 hover:bg-red-950/60
                               border border-red-800/40 hover:border-red-700/60
                               text-red-400 hover:text-red-300 font-medium text-sm
                               px-4 py-2.5 rounded-xl transition-all duration-150">
                    <span class="material-icons-round text-[18px]">delete</span>
                    លុបគ្រូ
                </button>

                {{-- Right: cancel + save --}}
                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <a href="{{ route('admin.teachers.show', $teacher) }}"
                       id="btn-cancel-edit-teacher"
                       class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                              bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                              text-gray-300 hover:text-white font-medium text-sm
                              px-5 py-2.5 rounded-xl transition-all duration-150">
                        <span class="material-icons-round text-[18px]">close</span>
                        បោះបង់
                    </a>

                    <button type="submit"
                            id="btn-submit-edit-teacher"
                            class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                                   bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                                   text-white font-semibold text-sm
                                   px-6 py-2.5 rounded-xl transition-all duration-150
                                   shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30
                                   disabled:opacity-50 disabled:cursor-not-allowed">
                        <span class="material-icons-round text-[18px]">save</span>
                        រក្សាទុកការផ្លាស់ប្ដូរ
                    </button>
                </div>
            </div>

        </form>
    </div>
</div>

@endsection

@push('scripts')
<script>
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

    // Disable submit on click to prevent double-submission
    document.getElementById('form-edit-teacher').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-edit-teacher');
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            កំពុងរក្សាទុក…
        `;
    });

    // Live password-match indicator
    const pwdInput   = document.getElementById('password');
    const pwdConfirm = document.getElementById('password_confirmation');
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
