{{--
    ── Reusable Pagination Partial ──
    Usage: @include('components.pagination', ['paginator' => $teachers])

    Renders:
      • "Showing X–Y of Z" info text
      • Previous / numbered page / Next buttons
      • Preserves all query-string params (search, filters) via $paginator->appends(request()->query())
--}}
@if($paginator->hasPages())
<div class="px-5 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">

    {{-- Info text --}}
    <p class="text-xs text-slate-500">
        {{ __('បង្ហាញ') }}
        <span class="text-slate-700 font-semibold">{{ $paginator->firstItem() }}</span>
        –
        <span class="text-slate-700 font-semibold">{{ $paginator->lastItem() }}</span>
        {{ __('នៃ') }}
        <span class="text-slate-700 font-semibold">{{ $paginator->total() }}</span>
        {{ $label ?? 'ធាតុ' }}
    </p>

    {{-- Page links --}}
    <nav class="flex items-center gap-1" aria-label="Pagination">

        {{-- Previous --}}
        @if($paginator->onFirstPage())
            <span aria-disabled="true"
                  class="inline-flex items-center justify-center w-9 h-9 rounded-xl
                         bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed select-none">
                <span class="material-icons-round text-[18px]">chevron_left</span>
            </span>
        @else
            <a href="{{ $paginator->previousPageUrl() }}"
               rel="prev"
               class="inline-flex items-center justify-center w-9 h-9 rounded-xl
                      bg-slate-100 border border-slate-200 text-slate-500
                      hover:bg-slate-200 hover:text-slate-800 transition-colors">
                <span class="material-icons-round text-[18px]">chevron_left</span>
            </a>
        @endif

        {{-- First page shortcut --}}
        @if($paginator->currentPage() > 3)
            <a href="{{ $paginator->url(1) }}"
               class="inline-flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-medium transition-colors
                      bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-800">
                1
            </a>
            @if($paginator->currentPage() > 4)
                <span class="text-slate-400 text-sm px-1">…</span>
            @endif
        @endif

        {{-- Windowed page numbers (current ±2) --}}
        @foreach($paginator->getUrlRange(
            max(1, $paginator->currentPage() - 2),
            min($paginator->lastPage(), $paginator->currentPage() + 2)
        ) as $page => $url)
            @if($page === $paginator->currentPage())
                <span aria-current="page"
                      class="inline-flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-semibold
                             bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200">
                    {{ $page }}
                </span>
            @else
                <a href="{{ $url }}"
                   class="inline-flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-medium transition-colors
                          bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-800">
                    {{ $page }}
                </a>
            @endif
        @endforeach

        {{-- Last page shortcut --}}
        @if($paginator->currentPage() < $paginator->lastPage() - 2)
            @if($paginator->currentPage() < $paginator->lastPage() - 3)
                <span class="text-slate-400 text-sm px-1">…</span>
            @endif
            <a href="{{ $paginator->url($paginator->lastPage()) }}"
               class="inline-flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-medium transition-colors
                      bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-800">
                {{ $paginator->lastPage() }}
            </a>
        @endif

        {{-- Next --}}
        @if($paginator->hasMorePages())
            <a href="{{ $paginator->nextPageUrl() }}"
               rel="next"
               class="inline-flex items-center justify-center w-9 h-9 rounded-xl
                      bg-slate-100 border border-slate-200 text-slate-500
                      hover:bg-slate-200 hover:text-slate-800 transition-colors">
                <span class="material-icons-round text-[18px]">chevron_right</span>
            </a>
        @else
            <span aria-disabled="true"
                  class="inline-flex items-center justify-center w-9 h-9 rounded-xl
                         bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed select-none">
                <span class="material-icons-round text-[18px]">chevron_right</span>
            </span>
        @endif

    </nav>
</div>
@endif
