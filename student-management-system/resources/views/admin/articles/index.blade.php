@extends('layouts.admin')

@section('title', 'ព័ត៌មាន & ជូនដំណឹង')
@section('page-title', 'ព័ត៌មាន & ជូនដំណឹង')
@section('breadcrumb')
    <span class="text-slate-500">ព័ត៌មាន & ជូនដំណឹង</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.articles.create') }}"
       class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800
              text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150
              shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30">
        <span class="material-icons-round text-[18px]">add_circle</span>
        <span>បន្ថែមអត្ថបទថ្មី</span>
    </a>
@endsection

@section('content')

{{-- Flash success --}}
@if(session('success'))
    <div class="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800
                rounded-xl px-4 py-3 mb-6 text-sm">
        <span class="material-icons-round text-emerald-500 text-[20px]">check_circle</span>
        {{ session('success') }}
    </div>
@endif

<div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

    {{-- Panel header --}}
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-wrap gap-3">
        <div class="flex items-center gap-2">
            <span class="material-icons-round text-indigo-500 text-[20px]">article</span>
            <h2 class="font-semibold text-slate-800 text-sm">បញ្ជីអត្ថបទ</h2>
            <span class="ml-1 bg-indigo-50 text-indigo-600 border border-indigo-100
                         text-xs px-2 py-0.5 rounded-full font-medium">
                {{ $articles->total() }}
            </span>
        </div>
    </div>

    {{-- Table --}}
    <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[700px]">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                    <th class="px-5 py-3 text-left font-semibold">ប្រភេទ</th>
                    <th class="px-5 py-3 text-left font-semibold">ចំណងជើង</th>
                    <th class="px-5 py-3 text-left font-semibold">រូបភាព</th>
                    <th class="px-5 py-3 text-left font-semibold">ស្ថានភាព</th>
                    <th class="px-5 py-3 text-left font-semibold">កាលបរិច្ឆេទ</th>
                    <th class="px-5 py-3 text-right font-semibold">សកម្មភាព</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                @forelse($articles as $article)
                    <tr class="hover:bg-slate-50 transition-colors group">

                        {{-- Type badge --}}
                        <td class="px-5 py-4">
                            @if($article->type === 'news')
                                <span class="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200
                                             text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold">
                                    <span class="material-icons-round text-[12px]">newspaper</span>
                                    ព័ត៌មាន
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200
                                             text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold">
                                    <span class="material-icons-round text-[12px]">campaign</span>
                                    ជូនដំណឹង
                                </span>
                            @endif
                        </td>

                        {{-- Title --}}
                        <td class="px-5 py-4">
                            <p class="font-semibold text-slate-800 leading-snug">{{ Str::limit($article->title, 55) }}</p>
                            <p class="text-xs text-slate-400 mt-0.5">{{ Str::limit(strip_tags($article->content), 60) }}</p>
                        </td>

                        {{-- Thumbnail --}}
                        <td class="px-5 py-4">
                            @if($article->image_path)
                                <img src="{{ asset('storage/' . $article->image_path) }}"
                                     alt="cover"
                                     class="w-16 h-10 object-cover rounded-lg border border-slate-200">
                            @else
                                <div class="w-16 h-10 bg-slate-100 rounded-lg border border-slate-200
                                            flex items-center justify-center">
                                    <span class="material-icons-round text-slate-300 text-[16px]">image</span>
                                </div>
                            @endif
                        </td>

                        {{-- Published status --}}
                        <td class="px-5 py-4">
                            @if($article->is_published)
                                <span class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100
                                             border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full
                                             font-bold uppercase tracking-wider">
                                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    ផ្សព្វផ្សាយ
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 text-slate-500 bg-slate-100
                                             border border-slate-200 text-[10px] px-2 py-0.5 rounded-full
                                             font-bold uppercase tracking-wider">
                                    ព្រាង
                                </span>
                            @endif
                        </td>

                        {{-- Date --}}
                        <td class="px-5 py-4 text-slate-500 text-xs">
                            {{ $article->created_at->format('d M Y') }}
                        </td>

                        {{-- Actions --}}
                        <td class="px-5 py-4 text-right">
                            <div class="flex items-center justify-end gap-1.5">
                                <a href="{{ route('admin.articles.edit', $article) }}"
                                   class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                          bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600
                                          transition-all">
                                    <span class="material-icons-round text-[16px]">edit</span>
                                </a>
                                <button
                                    onclick="openDeleteModal('{{ route('admin.articles.destroy', $article) }}', 'តើអ្នកចង់លុបអត្ថបទ «{{ addslashes($article->title) }}» មែនទេ?')"
                                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                                           bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600
                                           transition-all">
                                    <span class="material-icons-round text-[16px]">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <x-empty-state
                        colspan="6"
                        icon="article"
                        title="មិនទាន់មានអត្ថបទទេ"
                        description="សូមចុចប៊ូតុងខាងលើ ដើម្បីបន្ថែមអត្ថបទថ្មី។"
                        action_url="{{ route('admin.articles.create') }}"
                        action_text="បន្ថែមអត្ថបទថ្មី"
                    />
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- Pagination --}}
    @if($articles->hasPages())
        <div class="px-5 py-4 border-t border-slate-100">
            {{ $articles->links() }}
        </div>
    @endif
</div>

@endsection
