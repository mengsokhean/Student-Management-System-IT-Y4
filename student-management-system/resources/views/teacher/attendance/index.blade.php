@extends('layouts.teacher')

@section('title', 'កត់ត្រាវត្តមាន')
@section('page-title', 'កត់ត្រាវត្តមាន')

@section('breadcrumb')
    <span class="text-slate-600">វត្តមាន</span>
@endsection

@section('content')

{{-- ── Filter Form ── --}}
<form method="GET" action="{{ route('teacher.attendance.index') }}" id="filter-form">
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 mb-6">
        <h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span class="material-icons-round text-emerald-600 text-[20px]">filter_list</span>
            ជ្រើសរើសថ្នាក់ និងកាលបរិច្ឆេទ
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label for="classroom_id" class="block text-xs font-medium text-slate-500 mb-1">ថ្នាក់រៀន</label>
                <select name="classroom_id" id="classroom_id" onchange="this.form.submit()"
                        class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                    <option value="">— ជ្រើស​ថ្នាក់ —</option>
                    @foreach($classrooms as $cr)
                        <option value="{{ $cr->id }}" {{ request('classroom_id') == $cr->id ? 'selected' : '' }}>
                            {{ $cr->name }} ({{ $cr->grade->name ?? '' }} · {{ $cr->academicYear->name ?? '' }})
                        </option>
                    @endforeach
                </select>
            </div>
            <div>
                <label for="date" class="block text-xs font-medium text-slate-500 mb-1">កាលបរិច្ឆេទ</label>
                <input type="date" name="date" id="date" value="{{ $date }}"
                       onchange="this.form.submit()"
                       class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
            </div>
        </div>
    </div>
</form>

{{-- ── Attendance Entry ── --}}
@if($classroom && $students->isNotEmpty())
    <form method="POST" action="{{ route('teacher.attendance.bulk-store') }}">
        @csrf

        <input type="hidden" name="classroom_id" value="{{ $classroom->id }}">
        <input type="hidden" name="date"         value="{{ $date }}">

        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-slate-800">
                        {{ $classroom->name }} — {{ \Carbon\Carbon::parse($date)->translatedFormat('d F Y') }}
                    </h2>
                    <p class="text-xs text-slate-400 mt-0.5">{{ $students->count() }} សិស្សសកម្ម</p>
                </div>
                <button type="submit"
                        class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុក
                </button>
            </div>

            {{-- Quick status buttons --}}
            <div class="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3 flex-wrap">
                <span class="text-xs font-medium text-slate-500">ជ្រើសរើសទាំងអស់ ›</span>
                <button type="button" onclick="setAllStatus('present')"
                        class="text-xs px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-medium transition-colors">
                    ✓ មកទាំងអស់
                </button>
                <button type="button" onclick="setAllStatus('absent')"
                        class="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors">
                    ✗ អវត្តមានទាំងអស់
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-100">
                            <th class="px-5 py-3 text-left font-medium text-slate-500 w-8">#</th>
                            <th class="px-5 py-3 text-left font-medium text-slate-500">ឈ្មោះ</th>
                            <th class="px-5 py-3 text-center font-medium text-slate-500 text-emerald-700">
                                <span class="flex items-center justify-center gap-1">
                                    <span class="material-icons-round text-[16px]">check_circle</span> មក
                                </span>
                            </th>
                            <th class="px-5 py-3 text-center font-medium text-red-600">
                                <span class="flex items-center justify-center gap-1">
                                    <span class="material-icons-round text-[16px]">cancel</span> អវត្តមាន
                                </span>
                            </th>
                            <th class="px-5 py-3 text-center font-medium text-amber-600">
                                <span class="flex items-center justify-center gap-1">
                                    <span class="material-icons-round text-[16px]">schedule</span> យឺត
                                </span>
                            </th>
                            <th class="px-5 py-3 text-center font-medium text-sky-600">
                                <span class="flex items-center justify-center gap-1">
                                    <span class="material-icons-round text-[16px]">medical_services</span> ឈឺ
                                </span>
                            </th>
                            <th class="px-5 py-3 text-left font-medium text-slate-500">កំណត់ចំណាំ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach($students as $i => $student)
                            @php $existing = $attendance->get($student->id); @endphp
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="px-5 py-3 text-slate-400">{{ $i + 1 }}</td>
                                <td class="px-5 py-3">
                                    <p class="font-medium text-slate-800">{{ $student->name_kh }}</p>
                                    <p class="text-xs text-slate-400">{{ $student->name_en }}</p>
                                </td>
                                @foreach(['present', 'absent', 'late', 'sick'] as $status)
                                    <td class="px-5 py-3 text-center">
                                        <input type="radio"
                                               name="attendance[{{ $student->id }}][status]"
                                               value="{{ $status }}"
                                               id="att-{{ $student->id }}-{{ $status }}"
                                               class="status-radio-{{ $status }} w-4 h-4 cursor-pointer
                                                      @if($status === 'present') accent-emerald-600
                                                      @elseif($status === 'absent') accent-red-600
                                                      @elseif($status === 'late') accent-amber-500
                                                      @else accent-sky-600 @endif"
                                               {{ ($existing?->status === $status || (!$existing && $status === 'present')) ? 'checked' : '' }}>
                                    </td>
                                @endforeach
                                <td class="px-5 py-3">
                                    <input type="text"
                                           name="attendance[{{ $student->id }}][note]"
                                           value="{{ $existing?->note }}"
                                           placeholder="កំណត់ចំណាំ..."
                                           class="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs
                                                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-600">
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button type="submit"
                        class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុកវត្តមាន
                </button>
            </div>
        </div>
    </form>

@elseif($classroom && $students->isEmpty())
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">person_off</span>
        <p class="text-slate-500">មិនមានសិស្សសកម្មក្នុងថ្នាក់នេះទេ។</p>
    </div>

@elseif(!$classroom)
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">fact_check</span>
        <p class="text-slate-500 font-medium">សូមជ្រើសរើសថ្នាក់ និងកាលបរិច្ឆេទ ដើម្បីចាប់ផ្តើមកត់វត្តមាន។</p>
    </div>
@endif

@endsection

@push('scripts')
<script>
    function setAllStatus(status) {
        document.querySelectorAll('.status-radio-' + status).forEach(radio => {
            radio.checked = true;
        });
    }
</script>
@endpush
