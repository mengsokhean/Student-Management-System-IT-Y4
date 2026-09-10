@extends('layouts.admin')

@section('title', 'កំណត់ត្រាសកម្មភាព')
@section('page-title', 'កំណត់ត្រាសកម្មភាព')

@section('content')

<div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
    <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
            <h2 class="text-lg font-bold text-slate-800">កំណត់ត្រាប្រព័ន្ធ (System Logs)</h2>
            <p class="text-sm text-slate-500 mt-1">តាមដានសកម្មភាពរបស់អ្នកគ្រប់គ្រងទាំងអស់</p>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                    <th class="px-6 py-4 text-left font-semibold">កាលបរិច្ឆេទ</th>
                    <th class="px-6 py-4 text-left font-semibold">អ្នកប្រើប្រាស់</th>
                    <th class="px-6 py-4 text-left font-semibold">សកម្មភាព</th>
                    <th class="px-6 py-4 text-left font-semibold">ម៉ូឌុល</th>
                    <th class="px-6 py-4 text-left font-semibold">បរិយាយ</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
                @forelse($logs as $log)
                    <tr class="hover:bg-slate-50/70 transition-colors">
                        <td class="px-6 py-4 text-slate-500 whitespace-nowrap">
                            {{ $log->created_at->format('d M Y, h:i A') }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <span class="material-icons-round text-[16px] text-indigo-500">account_circle</span>
                                </div>
                                <span class="font-medium text-slate-700">{{ $log->user->name ?? 'System' }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            @php
                                $actionColors = [
                                    'created' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                    'updated' => 'bg-amber-50 text-amber-700 border-amber-200',
                                    'deleted' => 'bg-rose-50 text-rose-700 border-rose-200',
                                ];
                                $color = $actionColors[$log->action] ?? 'bg-slate-50 text-slate-700 border-slate-200';
                            @endphp
                            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border {{ $color }} uppercase tracking-wider">
                                {{ $log->action }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-slate-600 font-medium">{{ $log->model_type }}</span>
                        </td>
                        <td class="px-6 py-4 text-slate-600">
                            {{ $log->description }}
                        </td>
                    </tr>
                @empty
                    <x-empty-state 
                        colspan="5"
                        icon="receipt_long"
                        title="មិនទាន់មានកំណត់ត្រាទេ"
                        description="មិនមានសកម្មភាពត្រូវបានកត់ត្រានៅក្នុងប្រព័ន្ធនៅឡើយទេ។"
                    />
                @endforelse
            </tbody>
        </table>
    </div>

    @if($logs->hasPages())
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            {{ $logs->links() }}
        </div>
    @endif
</div>

@endsection
