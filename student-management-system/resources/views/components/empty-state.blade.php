@props([
    'colspan' => 1,
    'icon' => 'inbox',
    'title' => 'មិនទាន់មានទិន្នន័យ',
    'description' => 'មិនមានទិន្នន័យសម្រាប់បង្ហាញនៅពេលនេះទេ។',
    'action_url' => null,
    'action_text' => 'បង្កើតថ្មី',
])

<tr>
    <td colspan="{{ $colspan }}" class="px-5 py-20 text-center">
        <div class="flex flex-col items-center justify-center gap-4">
            <div class="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                <span class="material-icons-round text-slate-300 text-4xl">{{ $icon }}</span>
            </div>
            <div class="space-y-1 max-w-sm mx-auto">
                <h3 class="text-slate-700 font-bold text-base">{{ $title }}</h3>
                <p class="text-slate-400 text-sm leading-relaxed">{{ $description }}</p>
            </div>
            @if($action_url)
                <div class="mt-2">
                    <a href="{{ $action_url }}"
                       class="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm border border-indigo-100 hover:border-indigo-200">
                        <span class="material-icons-round text-[18px]">add</span>
                        {{ $action_text }}
                    </a>
                </div>
            @endif
        </div>
    </td>
</tr>
