@extends('layouts.admin')

@section('title', 'កម្រិតថ្នាក់')
@section('page-title', 'កម្រិតថ្នាក់')
@section('breadcrumb')
    <span class="text-slate-500">កម្រិតថ្នាក់</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.grades.create') }}"
       class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800
              text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150
              shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30">
        <span class="material-icons-round text-[18px]">add</span>
        <span>បន្ថែមថ្នាក់</span>
    </a>
@endsection

@section('content')

<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div class="flex items-center gap-2">
            <span class="material-icons-round text-indigo-500 text-[20px]">school</span>
            <h2 class="font-semibold text-slate-800 text-sm">បញ្ជីកម្រិតថ្នាក់</h2>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                    <th class="px-5 py-3 text-left font-semibold">កម្រិត (Level)</th>
                    <th class="px-5 py-3 text-left font-semibold">ឈ្មោះ</th>
                    <th class="px-5 py-3 text-center font-semibold">ចំនួនថ្នាក់រៀន</th>
                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($grades as $grade)
                    <tr class="hover:bg-slate-50 transition-colors group">
                        <td class="px-5 py-4">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold
                                         bg-indigo-50 border border-indigo-200 text-indigo-700">
                                {{ $grade->level }}
                            </span>
                        </td>
                        <td class="px-5 py-4">
                            <span class="font-medium text-slate-800">{{ $grade->name }}</span>
                        </td>
                        <td class="px-5 py-4 text-center">
                            <span class="inline-flex items-center bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200">
                                {{ $grade->classrooms_count ?? 0 }} ថ្នាក់
                            </span>
                        </td>
                        <td class="px-5 py-4">
                            <div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <a href="{{ route('admin.grades.edit', $grade) }}"
                                   title="កែប្រែ"
                                   class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                          bg-slate-100 hover:bg-indigo-100 border border-slate-200
                                          hover:border-indigo-300 text-slate-500 hover:text-indigo-600 transition-all">
                                    <span class="material-icons-round text-[16px]">edit</span>
                                </a>
                                <button type="button"
                                        title="លុប"
                                        onclick="openDeleteModal(
                                            '{{ route('admin.grades.destroy', $grade) }}',
                                            'តើអ្នកពិតជាចង់លុបកម្រិតថ្នាក់ទី {{ $grade->level }} មែនទេ?'
                                        )"
                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                               bg-slate-100 hover:bg-red-100 border border-slate-200
                                               hover:border-red-300 text-slate-500 hover:text-red-600 transition-all">
                                    <span class="material-icons-round text-[16px]">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="px-5 py-12 text-center text-slate-400">
                            មិនទាន់មានកម្រិតថ្នាក់ទេ
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@endsection
