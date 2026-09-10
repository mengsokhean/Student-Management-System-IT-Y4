@extends('layouts.admin')

@section('title', 'បន្ថែមឆ្នាំសិក្សា')
@section('page-title', 'បន្ថែមឆ្នាំសិក្សា')
@section('breadcrumb')
    <a href="{{ route('admin.academic-years.index') }}" class="hover:text-gray-300">ឆ្នាំសិក្សា</a>
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
                <span class="material-icons-round text-brand-400 text-[22px]">add_circle</span>
            </div>
            <div>
                <h2 class="font-semibold text-white">ព័ត៌មានឆ្នាំសិក្សា</h2>
                <p class="text-xs text-gray-400 mt-0.5">
                    បំពេញព័ត៌មានខាងក្រោម ដើម្បីបន្ថែមឆ្នាំសិក្សាថ្មី
                </p>
            </div>
        </div>

        <form method="POST"
              action="{{ route('admin.academic-years.store') }}"
              id="form-create-year"
              class="p-6 space-y-5">
            @csrf

            {{-- Year Name --}}
            <div>
                <label for="name" class="block text-sm font-medium text-gray-300 mb-1.5">
                    ឈ្មោះឆ្នាំសិក្សា <span class="text-red-400">*</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2
                                 material-icons-round text-gray-500 text-[18px]">school</span>
                    <input type="text"
                           id="name"
                           name="name"
                           value="{{ old('name') }}"
                           placeholder="ឧ. ២០២៤-២០២៥"
                           class="w-full bg-gray-800 border text-white placeholder-gray-600 rounded-xl
                                  pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                  {{ $errors->has('name') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                </div>
                @error('name')
                    <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                        <span class="material-icons-round text-[14px]">error_outline</span>
                        <span>{{ $message }}</span>
                    </div>
                @enderror
            </div>

            {{-- Dates row --}}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {{-- Start Date --}}
                <div>
                    <label for="start_date" class="block text-sm font-medium text-gray-300 mb-1.5">
                        ថ្ងៃចាប់ផ្ដើម <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2
                                     material-icons-round text-gray-500 text-[18px]">event</span>
                        <input type="date"
                               id="start_date"
                               name="start_date"
                               value="{{ old('start_date') }}"
                               class="w-full bg-gray-800 border text-white rounded-xl
                                      pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                      focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                      [color-scheme:dark]
                                      {{ $errors->has('start_date') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                    </div>
                    @error('start_date')
                        <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                            <span class="material-icons-round text-[14px]">error_outline</span>
                            <span>{{ $message }}</span>
                        </div>
                    @enderror
                </div>

                {{-- End Date --}}
                <div>
                    <label for="end_date" class="block text-sm font-medium text-gray-300 mb-1.5">
                        ថ្ងៃបញ្ចប់ <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2
                                     material-icons-round text-gray-500 text-[18px]">event_available</span>
                        <input type="date"
                               id="end_date"
                               name="end_date"
                               value="{{ old('end_date') }}"
                               class="w-full bg-gray-800 border text-white rounded-xl
                                      pl-10 pr-4 py-2.5 text-sm transition-all duration-150
                                      focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                      [color-scheme:dark]
                                      {{ $errors->has('end_date') ? 'border-red-500/60 bg-red-950/10' : 'border-gray-700 hover:border-gray-600' }}">
                    </div>
                    @error('end_date')
                        <div class="flex items-center gap-1.5 mt-1.5 text-red-400 text-xs">
                            <span class="material-icons-round text-[14px]">error_outline</span>
                            <span>{{ $message }}</span>
                        </div>
                    @enderror
                </div>
            </div>

            {{-- Duration preview --}}
            <div id="duration-preview"
                 class="hidden items-center gap-2 bg-brand-950/30 border border-brand-800/30
                        rounded-xl px-4 py-3 text-xs text-brand-300">
                <span class="material-icons-round text-brand-400 text-[16px]">hourglass_empty</span>
                <span id="duration-text">—</span>
            </div>

            {{-- Divider --}}
            <div class="border-t border-gray-800"></div>

            {{-- Is Active Toggle --}}
            <div>
                <div class="flex items-start gap-4">
                    <div class="relative flex-shrink-0 mt-0.5">
                        <input type="hidden" name="is_active" value="0">
                        <input type="checkbox"
                               id="is_active"
                               name="is_active"
                               value="1"
                               {{ old('is_active') ? 'checked' : '' }}
                               class="sr-only peer">
                        <label for="is_active"
                               class="flex items-center w-11 h-6 bg-gray-700 border border-gray-600 rounded-full
                                      cursor-pointer transition-all duration-200
                                      peer-checked:bg-brand-600 peer-checked:border-brand-500
                                      hover:border-gray-500">
                            <span class="absolute left-0.5 w-5 h-5 bg-gray-400 rounded-full shadow
                                         transition-all duration-200
                                         peer-checked:translate-x-5 peer-checked:bg-white
                                         translate-x-0.5"></span>
                        </label>
                    </div>
                    <div>
                        <label for="is_active" class="text-sm font-medium text-gray-300 cursor-pointer">
                            កំណត់ជាឆ្នាំសិក្សាបច្ចុប្បន្ន
                        </label>
                        <p class="text-xs text-gray-500 mt-0.5">
                            ឆ្នាំសិក្សាចាស់ដែលកំពុងដំណើរការ
                            នឹងត្រូវបានកំណត់ជា "បញ្ចប់" ដោយស្វ័យប្រវត្តិ
                        </p>
                    </div>
                </div>
            </div>

            {{-- Warning if no active year --}}
            <div class="flex items-start gap-2 bg-amber-950/20 border border-amber-800/30 rounded-xl px-4 py-3">
                <span class="material-icons-round text-amber-500 text-[16px] flex-shrink-0 mt-0.5">info</span>
                <p class="text-xs text-amber-200/70 leading-relaxed">
                    គ្រប់ប្រតិបត្តិការ ដូចជា ការចុះឈ្មោះ និងការប្រឡង
                    ត្រូវការ <span class="font-medium text-amber-300">ឆ្នាំសិក្សាបច្ចុប្បន្ន</span>
                    ដែលកំណត់ "សកម្ម"។ ត្រូវប្រាកដថាឆ្នាំមួយ ត្រូវបានកំណត់សកម្មជានិច្ច។
                </p>
            </div>

            {{-- Divider --}}
            <div class="border-t border-gray-800"></div>

            {{-- Actions --}}
            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-1">
                <a href="{{ route('admin.academic-years.index') }}"
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                          bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600
                          text-gray-300 hover:text-white font-medium text-sm
                          px-5 py-2.5 rounded-xl transition-all duration-150">
                    <span class="material-icons-round text-[18px]">arrow_back</span>
                    បោះបង់
                </a>
                <button type="submit"
                        id="btn-submit-year"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                               bg-brand-600 hover:bg-brand-700 active:bg-brand-800
                               text-white font-semibold text-sm
                               px-6 py-2.5 rounded-xl transition-all duration-150
                               shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុក
                </button>
            </div>

        </form>
    </div>
</div>

@endsection

@push('scripts')
<script>
    // Live duration preview between start and end date
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

    // Submit protection
    document.getElementById('form-create-year').addEventListener('submit', function () {
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
