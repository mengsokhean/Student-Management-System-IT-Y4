@extends('layouts.teacher')

@section('title', 'បញ្ចូលពិន្ទុ')
@section('page-title', 'បញ្ចូលពិន្ទុ')

@section('breadcrumb')
    <span class="text-slate-600">ពិន្ទុ</span>
@endsection

@section('content')

{{-- ── Filter Form ── --}}
<form method="GET" action="{{ route('teacher.scores.index') }}" id="score-filter-form">
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 mb-6">
        <h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span class="material-icons-round text-emerald-600 text-[20px]">filter_list</span>
            ជ្រើសរើស​ថ្នាក់ · មុខវិជ្ជា · ឆមាស
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label for="classroom_id" class="block text-xs font-medium text-slate-500 mb-1">ថ្នាក់រៀន</label>
                <select name="classroom_id" id="classroom_id"
                        onchange="document.getElementById('score-filter-form').submit()"
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
                <label for="subject_id" class="block text-xs font-medium text-slate-500 mb-1">មុខវិជ្ជា</label>
                <select name="subject_id" id="subject_id"
                        onchange="document.getElementById('score-filter-form').submit()"
                        class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        {{ $subjects->isEmpty() ? 'disabled' : '' }}>
                    <option value="">— ជ្រើស​មុខវិជ្ជា —</option>
                    @foreach($subjects as $subj)
                        <option value="{{ $subj->id }}" {{ request('subject_id') == $subj->id ? 'selected' : '' }}>
                            {{ $subj->name_kh }} ({{ $subj->name_en }})
                        </option>
                    @endforeach
                </select>
            </div>
            <div>
                <label for="semester" class="block text-xs font-medium text-slate-500 mb-1">ឆមាស</label>
                <select name="semester" id="semester"
                        onchange="document.getElementById('score-filter-form').submit()"
                        class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                    <option value="1" {{ $semester == 1 ? 'selected' : '' }}>ឆមាសទី ១</option>
                    <option value="2" {{ $semester == 2 ? 'selected' : '' }}>ឆមាសទី ២</option>
                </select>
            </div>
        </div>
    </div>
</form>

{{-- ── Score Entry Table ── --}}
@if($classroom && $subject && $students->isNotEmpty())
    <form method="POST" action="{{ route('teacher.scores.bulk-store') }}">
        @csrf

        <input type="hidden" name="classroom_id"     value="{{ $classroom->id }}">
        <input type="hidden" name="subject_id"        value="{{ $subject->id }}">
        <input type="hidden" name="academic_year_id" value="{{ $academicYear->id }}">
        <input type="hidden" name="semester"          value="{{ $semester }}">

        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 class="font-semibold text-slate-800">
                        {{ $classroom->name }} — {{ $subject->name_kh }}
                        <span class="ml-2 text-sm font-normal text-slate-400">ឆមាស {{ $semester }}</span>
                    </h2>
                    <p class="text-xs text-slate-400 mt-0.5">ពិន្ទុ ០ – ១០០</p>
                </div>
                <button type="submit"
                        class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុក
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-100">
                            <th class="px-4 py-3 text-left font-medium text-slate-500 w-8">#</th>
                            <th class="px-4 py-3 text-left font-medium text-slate-500">ឈ្មោះ</th>
                            <th class="px-4 py-3 text-center font-medium text-slate-600 w-24">
                                <div class="text-xs">ខែ ១</div>
                                <div class="text-[10px] text-slate-400 font-normal">Month 1</div>
                            </th>
                            <th class="px-4 py-3 text-center font-medium text-slate-600 w-24">
                                <div class="text-xs">ខែ ២</div>
                                <div class="text-[10px] text-slate-400 font-normal">Month 2</div>
                            </th>
                            <th class="px-4 py-3 text-center font-medium text-slate-600 w-24">
                                <div class="text-xs">ខែ ៣</div>
                                <div class="text-[10px] text-slate-400 font-normal">Month 3</div>
                            </th>
                            <th class="px-4 py-3 text-center font-medium text-slate-600 w-24">
                                <div class="text-xs">ខែ ៤</div>
                                <div class="text-[10px] text-slate-400 font-normal">Month 4</div>
                            </th>
                            <th class="px-4 py-3 text-center font-medium text-indigo-600 w-28">
                                <div class="text-xs">ប្រឡង</div>
                                <div class="text-[10px] text-slate-400 font-normal">Exam</div>
                            </th>
                            <th class="px-4 py-3 text-center font-medium text-emerald-700 w-24">
                                <div class="text-xs">មធ្យម</div>
                                <div class="text-[10px] text-slate-400 font-normal">Average</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100" id="score-table-body">
                        @foreach($students as $i => $student)
                            @php $sc = $scores->get($student->id); @endphp
                            <tr class="hover:bg-slate-50 transition-colors score-row" data-student="{{ $student->id }}">
                                <td class="px-4 py-3 text-slate-400">{{ $i + 1 }}</td>
                                <td class="px-4 py-3">
                                    <p class="font-medium text-slate-800">{{ $student->name_kh }}</p>
                                    <p class="text-xs text-slate-400">{{ $student->name_en }}</p>
                                </td>
                                @foreach(['month1', 'month2', 'month3', 'month4'] as $field)
                                    <td class="px-4 py-3 text-center">
                                        <input type="number"
                                               name="scores[{{ $student->id }}][{{ $field }}]"
                                               value="{{ $sc?->{$field} }}"
                                               min="0" max="100" step="0.01"
                                               placeholder="—"
                                               data-student="{{ $student->id }}"
                                               data-field="{{ $field }}"
                                               oninput="calcAverage({{ $student->id }})"
                                               class="score-input w-20 text-center border border-slate-200 rounded-lg px-2 py-1.5 text-sm
                                                      focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                                    </td>
                                @endforeach
                                <td class="px-4 py-3 text-center">
                                    <input type="number"
                                           name="scores[{{ $student->id }}][exam_score]"
                                           value="{{ $sc?->exam_score }}"
                                           min="0" max="100" step="0.01"
                                           placeholder="—"
                                           data-student="{{ $student->id }}"
                                           data-field="exam_score"
                                           oninput="calcAverage({{ $student->id }})"
                                           class="score-input w-20 text-center border border-indigo-200 bg-indigo-50 rounded-lg px-2 py-1.5 text-sm
                                                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span id="avg-{{ $student->id }}"
                                          class="text-sm font-bold text-emerald-600">
                                        @if($sc && !is_null($sc->month1) && !is_null($sc->month2) && !is_null($sc->month3) && !is_null($sc->month4) && !is_null($sc->exam_score))
                                            {{ round((($sc->month1 + $sc->month2 + $sc->month3 + $sc->month4) + ($sc->exam_score * 2)) / 6, 2) }}
                                        @else
                                            —
                                        @endif
                                    </span>
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
                    រក្សាទុកពិន្ទុ
                </button>
            </div>
        </div>
    </form>

@elseif($classroom && $subject && $students->isEmpty())
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">person_off</span>
        <p class="text-slate-500">មិនមានសិស្សសកម្មក្នុងថ្នាក់នេះទេ។</p>
    </div>

@else
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">grade</span>
        <p class="text-slate-500 font-medium">សូមជ្រើសរើសថ្នាក់ មុខវិជ្ជា និងឆមាស ដើម្បីចាប់ផ្តើមបញ្ចូលពិន្ទុ។</p>
    </div>
@endif

@endsection

@push('scripts')
<script>
    /**
     * Recalculate semester average for a student row live.
     * Formula: ((m1+m2+m3+m4) + exam*2) / 6
     */
    function calcAverage(studentId) {
        const fields = ['month1','month2','month3','month4','exam_score'];
        const values = fields.map(f => {
            const el = document.querySelector(`input[data-student="${studentId}"][data-field="${f}"]`);
            return el && el.value !== '' ? parseFloat(el.value) : null;
        });

        const avgEl = document.getElementById('avg-' + studentId);
        if (values.some(v => v === null)) {
            avgEl.textContent = '—';
            avgEl.className = 'text-sm font-bold text-slate-400';
            return;
        }
        const [m1, m2, m3, m4, exam] = values;
        const avg = ((m1 + m2 + m3 + m4) + (exam * 2)) / 6;
        avgEl.textContent = avg.toFixed(2);
        avgEl.className = 'text-sm font-bold ' + (avg >= 50 ? 'text-emerald-600' : 'text-red-500');
    }
</script>
@endpush
