@extends('layouts.teacher')

@section('title', 'របាយការណ៍វត្តមានសិស្ស')
@section('page-title', 'របាយការណ៍វត្តមានសិស្ស')

@section('breadcrumb')
    <span class="text-slate-600">របាយការណ៍វត្តមាន</span>
@endsection

@section('content')

{{-- ── Filter Form ── --}}
<form method="GET" action="{{ route('teacher.attendance.student-report') }}">
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 mb-6">
        <h2 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span class="material-icons-round text-emerald-600 text-[20px]">filter_list</span>
            ជ្រើសរើសថ្នាក់
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
    </div>
</form>

{{-- ── Summary Table ── --}}
@if($classroom && $report->isNotEmpty())
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
            <h2 class="font-semibold text-slate-800">
                {{ $classroom->name }} — {{ $classroom->academicYear->name ?? '' }}
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">ចំនួនថ្ងៃចូលរៀនសរុបក្នុងឆ្នាំសិក្សា</p>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-100">
                        <th class="px-5 py-3 text-left font-medium text-slate-500 w-8">#</th>
                        <th class="px-5 py-3 text-left font-medium text-slate-500">ឈ្មោះ</th>
                        <th class="px-5 py-3 text-center font-medium text-slate-500">សរុប</th>
                        <th class="px-5 py-3 text-center font-medium text-emerald-700">
                            <span class="flex items-center justify-center gap-1">
                                <span class="material-icons-round text-[15px]">check_circle</span> មក
                            </span>
                        </th>
                        <th class="px-5 py-3 text-center font-medium text-red-600">
                            <span class="flex items-center justify-center gap-1">
                                <span class="material-icons-round text-[15px]">cancel</span> អវត្តមាន
                            </span>
                        </th>
                        <th class="px-5 py-3 text-center font-medium text-amber-600">
                            <span class="flex items-center justify-center gap-1">
                                <span class="material-icons-round text-[15px]">schedule</span> យឺត
                            </span>
                        </th>
                        <th class="px-5 py-3 text-center font-medium text-sky-600">
                            <span class="flex items-center justify-center gap-1">
                                <span class="material-icons-round text-[15px]">medical_services</span> ឈឺ
                            </span>
                        </th>
                        <th class="px-5 py-3 text-center font-medium text-slate-500">% វត្តមាន</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($report as $i => $row)
                        @php
                            $pct = $row['total'] > 0
                                ? round(($row['present'] / $row['total']) * 100)
                                : 0;
                            $pctColor = $pct >= 80 ? 'text-emerald-600' : ($pct >= 60 ? 'text-amber-600' : 'text-red-600');
                        @endphp
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-5 py-3.5 text-slate-400">{{ $i + 1 }}</td>
                            <td class="px-5 py-3.5">
                                <p class="font-medium text-slate-800">{{ $row['student']->name_kh }}</p>
                                <p class="text-xs text-slate-400">{{ $row['student']->name_en }}</p>
                            </td>
                            <td class="px-5 py-3.5 text-center font-semibold text-slate-700">{{ $row['total'] }}</td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs">
                                    {{ $row['present'] }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold text-xs">
                                    {{ $row['absent'] }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-xs">
                                    {{ $row['late'] }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="inline-block px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-semibold text-xs">
                                    {{ $row['sick'] }}
                                </span>
                            </td>
                            <td class="px-5 py-3.5 text-center">
                                <span class="font-bold {{ $pctColor }}">{{ $pct }}%</span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

@elseif($classroom && $report->isEmpty())
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">person_search</span>
        <p class="text-slate-500">មិនមានទិន្នន័យវត្តមានសម្រាប់ថ្នាក់នេះទេ។</p>
    </div>

@else
    <div class="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <span class="material-icons-round text-slate-300 text-5xl mb-3 block">person_search</span>
        <p class="text-slate-500 font-medium">សូមជ្រើសរើសថ្នាក់ ដើម្បីមើលរបាយការណ៍វត្តមាន។</p>
    </div>
@endif

@endsection
