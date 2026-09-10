@extends('layouts.admin')

@section('title', 'កែប្រែឆ្នាំសិក្សា')
@section('page-title', 'កែប្រែឆ្នាំសិក្សា')
@section('breadcrumb')
    <a href="{{ route('admin.academic-years.index') }}" class="hover:text-slate-700">ឆ្នាំសិក្សា</a>
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
                <span class="material-icons-round text-indigo-500 text-[22px]">edit_calendar</span>
            </div>
            <div>
                <h2 class="font-semibold text-slate-800">{{ $academicYear->name }}</h2>
            </div>
        </div>

        <form method="POST"
              action="{{ route('admin.academic-years.update', $academicYear) }}"
              id="form-edit-year"
              class="p-6 space-y-5">
            @csrf
            @method('PUT')

            {{-- Year Name --}}
            <div>
                <label for="name" class="block text-sm font-medium text-slate-700 mb-1.5">
                    ឈ្មោះឆ្នាំសិក្សា <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2
                                 material-icons-round text-slate-400 text-[18px]">school</span>
                    <input type="text"
                           id="name"
                           name="name"
                           value="{{ old('name', $academicYear->name) }}"
                           placeholder="ឧ. ២០២៤-២០២៥"
                           class="w-full bg-white border text-slate-800 placeholder-slate-400 rounded-xl
                                  pl-10 pr-4 py-2.5 text-sm transition-all duration-150
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

            {{-- Dates row --}}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {{-- Start Date --}}
                <div>
                    <label for="start_date" class="block text-sm font-medium text-slate-700 mb-1.5">
                        ថ្ងៃចាប់ផ្ដើម <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2
                                     material-icons-round text-slate-400 text-[18px]">event</span>
                        <input type="date"
                               id="start_date"
                               name="start_date"
                               value="{{ old('start_date', \Carbon\Carbon::parse($academicYear->start_date)->format('Y-m-d')) }}"
                               class="w-full bg-white border text-slate-800 rounded-xl
                                      pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                      [color-scheme:light]
                                      {{ $errors->has('start_date') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                    </div>
                    @error('start_date')
                        <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                            <span class="material-icons-round text-[14px]">error_outline</span>
                            <span>{{ $message }}</span>
                        </div>
                    @enderror
                </div>

                {{-- End Date --}}
                <div>
                    <label for="end_date" class="block text-sm font-medium text-slate-700 mb-1.5">
                        ថ្ងៃបញ្ចប់ <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2
                                     material-icons-round text-slate-400 text-[18px]">event_available</span>
                        <input type="date"
                               id="end_date"
                               name="end_date"
                               value="{{ old('end_date', \Carbon\Carbon::parse($academicYear->end_date)->format('Y-m-d')) }}"
                               class="w-full bg-white border text-slate-800 rounded-xl
                                      pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                                      [color-scheme:light]
                                      {{ $errors->has('end_date') ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400' }}">
                    </div>
                    @error('end_date')
                        <div class="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs">
                            <span class="material-icons-round text-[14px]">error_outline</span>
                            <span>{{ $message }}</span>
                        </div>
                    @enderror
                </div>
            </div>

            {{-- Duration preview --}}
            <div id="duration-preview"
                 class="hidden items-center gap-2 bg-indigo-50 border border-indigo-200
                        rounded-xl px-4 py-3 text-xs text-indigo-700">
                <span class="material-icons-round text-indigo-400 text-[16px]">hourglass_empty</span>
                <span id="duration-text">—</span>
            </div>

            {{-- Divider --}}
            <div class="border-t border-slate-200"></div>

            {{-- Is Active Toggle --}}
            <div>
                <div class="flex items-start gap-4">
                    <div class="relative flex-shrink-0 mt-0.5">
                        <input type="hidden" name="is_active" value="0">
                        <input type="checkbox"
                               id="is_active"
                               name="is_active"
                               value="1"
                               {{ old('is_active', $academicYear->is_active) ? 'checked' : '' }}
                               class="sr-only peer">
                        <label for="is_active"
                               class="flex items-center w-11 h-6 bg-slate-200 border border-slate-300 rounded-full
                                      cursor-pointer transition-all duration-200
                                      peer-checked:bg-indigo-600 peer-checked:border-indigo-500
                                      hover:border-slate-400">
                            <span class="absolute left-0.5 w-5 h-5 bg-white rounded-full shadow
                                         transition-all duration-200
                                         peer-checked:translate-x-5 peer-checked:bg-white
                                         translate-x-0.5"></span>
                        </label>
                    </div>
                    <div>
                        <label for="is_active" class="text-sm font-medium text-slate-700 cursor-pointer">
                            កំណត់ជាឆ្នាំសិក្សាបច្ចុប្បន្ន
                        </label>
                    </div>
                </div>
            </div>

            {{-- Active year warning --}}
            @if(!$academicYear->is_active)
                <div class="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <span class="material-icons-round text-amber-500 text-[16px] flex-shrink-0 mt-0.5">info</span>
                    <p class="text-xs text-amber-700 leading-relaxed">
                        ប្រព័ន្ធទាមទារ <span class="font-medium text-amber-800">ឆ្នាំសិក្សាបច្ចុប្បន្ន</span>
                        ដើម្បីដំណើរការការចុះឈ្មោះ និងការប្រឡង។
                    </p>
                </div>
            @endif

            {{-- Divider --}}
            <div class="border-t border-slate-200"></div>

            {{-- Actions --}}
            <div class="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-1">
                <a href="{{ route('admin.academic-years.index') }}"
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                          bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400
                          text-slate-600 hover:text-slate-800 font-medium text-sm
                          px-5 py-2.5 rounded-xl transition-all duration-150">
                    <span class="material-icons-round text-[18px]">arrow_back</span>
                    ត្រឡប់ក្រោយ
                </a>
                <button type="submit"
                        id="btn-submit-year"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                               bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                               text-white font-semibold text-sm
                               px-6 py-2.5 rounded-xl transition-all duration-150
                               shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុកការកែប្រែ
                </button>
            </div>

        </form>
    </div>
</div>

@endsection

@push('scripts')
<script>
    const startInput = document.getElementById('start_date');
    const endInput   = document.getElementById('end_date');
    const preview    = document.getElementById('duration-preview');
    const previewTxt = document.getElementById('duration-text');

    function updateDuration() {
        const start = new Date(startInput.value);
        const end   = new Date(endInput.value);
        if (startInput.value && endInput.value && end > start) {
            const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30.44));
            previewTxt.textContent = 'រយៈពេល: ' + months + ' ខែ';
            preview.classList.replace('hidden', 'flex');
        } else {
            preview.classList.replace('flex', 'hidden');
        }
    }

    startInput.addEventListener('change', updateDuration);
    endInput.addEventListener('change', updateDuration);
    updateDuration(); // run on load with pre-filled dates

    document.getElementById('form-edit-year').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-year');
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
