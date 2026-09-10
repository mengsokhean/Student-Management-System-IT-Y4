@extends('layouts.admin')

@section('title', 'កែប្រែកម្រិតថ្នាក់')
@section('page-title', 'កែប្រែកម្រិតថ្នាក់')
@section('breadcrumb')
    <a href="{{ route('admin.grades.index') }}" class="hover:text-gray-300">កម្រិតថ្នាក់</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">កែប្រែ</span>
@endsection

@section('content')

<form method="POST" action="{{ route('admin.grades.update', $grade) }}" class="max-w-2xl mx-auto">
    @csrf
    @method('PUT')

    <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-5">
        <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-800/30">
            <span class="material-icons-round text-brand-400 text-[18px]">school</span>
            <h2 class="font-semibold text-white text-sm">ព័ត៌មានកម្រិតថ្នាក់</h2>
        </div>

        <div class="p-6 space-y-5">
            <div>
                <label for="level" class="block text-sm font-medium text-gray-300 mb-1.5">
                    កម្រិត (Level) <span class="text-red-400">*</span>
                </label>
                <input type="number" id="level" name="level"
                       value="{{ old('level', $grade->level) }}"
                       class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                @error('level')
                    <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                        <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                    </div>
                @enderror
            </div>

            <div>
                <label for="name" class="block text-sm font-medium text-gray-300 mb-1.5">
                    ឈ្មោះថ្នាក់ <span class="text-red-400">*</span>
                </label>
                <input type="text" id="name" name="name"
                       value="{{ old('name', $grade->name) }}"
                       class="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                @error('name')
                    <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                        <span class="material-icons-round text-[14px]">error_outline</span><span>{{ $message }}</span>
                    </div>
                @enderror
            </div>
        </div>
    </div>

    <div class="flex items-center gap-3">
        <a href="{{ route('admin.grades.index') }}"
           class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                  bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                  text-gray-300 hover:text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-all">
            បោះបង់
        </a>
        <button type="submit"
                class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                       bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm
                       px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-600/20">
            <span class="material-icons-round text-[18px]">save</span>
            រក្សាទុក
        </button>
    </div>
</form>

@endsection
