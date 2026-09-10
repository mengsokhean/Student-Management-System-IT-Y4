@extends('layouts.admin')

@section('title', 'ឆ្នាំសិក្សា')
@section('page-title', 'ឆ្នាំសិក្សា')
@section('breadcrumb')
    <span class="text-slate-500">ឆ្នាំសិក្សា</span>
@endsection

@section('header-actions')
    <div class="flex items-center gap-2">
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_download</span>
            Import
        </button>
        <button type="button" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-2">
            <span class="material-icons-round text-[18px]">file_upload</span>
            Export
        </button>
        <a href="{{ route('admin.academic-years.create') }}" class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30">
            <span class="material-icons-round text-[18px]">add_circle</span>
            <span>បន្ថែមឆ្នាំសិក្សាថ្មី</span>
        </a>
    </div>
@endsection

@section('content')

<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-2">
            <span class="material-icons-round text-indigo-500 text-[20px]">calendar_month</span>
            <h2 class="font-semibold text-slate-800 text-sm">បញ្ជីឆ្នាំសិក្សា</h2>
            <span class="ml-1 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs px-2 py-0.5 rounded-full font-medium">{{ $academicYears->count() }}</span>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[500px]">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                    <th class="w-12 px-5 py-3 text-center font-semibold">
                        <input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                    </th>
                    <th class="px-5 py-3 text-left font-semibold">ឈ្មោះឆ្នាំសិក្សា</th>
                    <th class="px-5 py-3 text-left font-semibold">ថ្ងៃចាប់ផ្តើម</th>
                    <th class="px-5 py-3 text-left font-semibold">ថ្ងៃបញ្ចប់</th>
                    <th class="px-5 py-3 text-center font-semibold">ស្ថានភាព</th>
                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($academicYears as $ay)
                    <tr class="hover:bg-slate-50 transition-colors group">
                        <td class="px-5 py-4 text-center">
                            <input type="checkbox" value="{{ $ay->id }}" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
                        </td>
                        <td class="px-5 py-4 font-bold text-slate-800">{{ $ay->name }}</td>
                        <td class="px-5 py-4 text-slate-600">{{ $ay->start_date ? \Carbon\Carbon::parse($ay->start_date)->format('d M Y') : '-' }}</td>
                        <td class="px-5 py-4 text-slate-600">{{ $ay->end_date ? \Carbon\Carbon::parse($ay->end_date)->format('d M Y') : '-' }}</td>
                        <td class="px-5 py-4 text-center">
                            @if($ay->is_active)
                                <span class="inline-flex items-center bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200">សកម្ម</span>
                            @else
                                <span class="inline-flex items-center bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full border border-slate-200">អសកម្ម</span>
                            @endif
                        </td>
                        <td class="px-5 py-4 text-right">
                            <a href="{{ route('admin.academic-years.edit', $ay) }}" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 transition-all">
                                <span class="material-icons-round text-[16px]">edit</span>
                            </a>
                            <button onclick="openDeleteModal('{{ route('admin.academic-years.destroy', $ay) }}', 'តើអ្នកចង់លុបឆ្នាំសិក្សា {{ $ay->name }} មែនទេ?')" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 transition-all">
                                <span class="material-icons-round text-[16px]">delete</span>
                            </button>
                        </td>
                    </tr>
                @empty
                    <x-empty-state 
                        colspan="6"
                        icon="calendar_month"
                        title="មិនទាន់មានទិន្នន័យឆ្នាំសិក្សាទេ"
                        description="សូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតឆ្នាំសិក្សាថ្មី។"
                        action_url="{{ route('admin.academic-years.create') }}"
                        action_text="បង្កើតឆ្នាំសិក្សាថ្មី"
                    />
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
