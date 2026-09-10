@extends('layouts.admin')

@section('title', 'កែប្រែមុខវិជ្ជា')
@section('page-title', 'កែប្រែមុខវិជ្ជា')
@section('breadcrumb')
    <a href="{{ route('admin.subjects.index') }}" class="hover:text-slate-700">មុខវិជ្ជា</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-slate-500">កែប្រែ</span>
@endsection

@section('content')

<div class="max-w-2xl mx-auto">
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {{-- Card Header --}}
        <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50/70">
            <div class="w-11 h-11 bg-indigo-50 border border-indigo-200 rounded-xl
                        flex items-center justify-center flex-shrink-0">
                <span class="material-icons-round text-indigo-500 text-[22px]">menu_book</span>
            </div>
            <div>
                <h2 class="font-semibold text-slate-800">កែប្រែព័ត៌មានមុខវិជ្ជា</h2>
                <p class="text-xs text-slate-500 mt-0.5">
                    កែប្រែទិន្នន័យមុខវិជ្ជា៖ {{ $subject->name_en }} ({{ $subject->code }})
                </p>
            </div>
        </div>

        <form method="POST"
              action="{{ route('admin.subjects.update', $subject) }}"
              id="form-edit-subject"
              class="p-6 space-y-5">
            @csrf
            @method('PUT')

            {{-- ── Subject Code ── --}}
            <div>
                <label for="code" class="block text-sm font-medium text-slate-700 mb-1.5">
                    លេខកូដ <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">tag</span>
                    <input type="text"
                           id="code"
                           name="code"
                           value="{{ old('code', $subject->code) }}"
                           placeholder="ឧ. MATH-101"
                           class="w-full bg-white border text-slate-800 placeholder-slate-400 rounded-xl
                                  pl-10 pr-4 py-2.5 text-sm font-mono transition-all duration-150
                                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                  {{ $errors->has('code') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                </div>
                @error('code')
                    <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                        <span class="material-icons-round text-[14px]">error_outline</span>
                        <span>{{ $message }}</span>
                    </div>
                @enderror
            </div>

            {{-- ── Name Khmer ── --}}
            <div>
                <label for="name_kh" class="block text-sm font-medium text-slate-700 mb-1.5">
                    ឈ្មោះ (ភាសាខ្មែរ) <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">translate</span>
                    <input type="text"
                           id="name_kh"
                           name="name_kh"
                           value="{{ old('name_kh', $subject->name_kh) }}"
                           placeholder="ឧ. គណិតវិទ្យា"
                           class="w-full bg-white border text-slate-800 placeholder-slate-400 rounded-xl
                                  pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                  {{ $errors->has('name_kh') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                </div>
                @error('name_kh')
                    <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                        <span class="material-icons-round text-[14px]">error_outline</span>
                        <span>{{ $message }}</span>
                    </div>
                @enderror
            </div>

            {{-- ── Name English ── --}}
            <div>
                <label for="name_en" class="block text-sm font-medium text-slate-700 mb-1.5">
                    ឈ្មោះ (អក្សរឡាតាំង) <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">spellcheck</span>
                    <input type="text"
                           id="name_en"
                           name="name_en"
                           value="{{ old('name_en', $subject->name_en) }}"
                           placeholder="ឧ. Mathematics"
                           class="w-full bg-white border text-slate-800 placeholder-slate-400 rounded-xl
                                  pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                  {{ $errors->has('name_en') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                </div>
                @error('name_en')
                    <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                        <span class="material-icons-round text-[14px]">error_outline</span>
                        <span>{{ $message }}</span>
                    </div>
                @enderror
            </div>

            {{-- Action Buttons --}}
            <div class="flex items-center gap-3 pt-4 border-t border-slate-200">
                <a href="{{ route('admin.subjects.index') }}"
                   class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                          bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400
                          text-slate-700 font-medium text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm">
                    បោះបង់
                </a>
                <button type="submit"
                        class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                               bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm
                               px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-600/20 hover:shadow-brand-600/30">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុក
                </button>
            </div>
        </form>
    </div>
</div>

@endsection
