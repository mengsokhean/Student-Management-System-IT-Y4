<!DOCTYPE html>
<html lang="km" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'ប្រព័ន្ធគ្រប់គ្រងសាលា') — ផ្នែកគ្រូបង្រៀន</title>

    {{-- Google Fonts: Kantumruy Pro (Khmer) + Inter (Latin) --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    {{-- Google Material Icons --}}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">

    {{-- Tailwind CSS CDN --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Kantumruy Pro', 'Inter', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50:  '#ecfdf5',
                            100: '#d1fae5',
                            200: '#a7f3d0',
                            400: '#34d399',
                            500: '#10b981',
                            600: '#059669',
                            700: '#047857',
                            800: '#065f46',
                            900: '#064e3b',
                        },
                    },
                }
            }
        }
    </script>

    <style type="text/tailwindcss">
        @layer base {
            body { @apply font-sans; }
        }
        /* Sidebar active state */
        .nav-link-active {
            @apply bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600 font-semibold;
        }
        /* Smooth page transitions */
        .page-content {
            animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { @apply bg-slate-100; }
        ::-webkit-scrollbar-thumb { @apply bg-slate-300 rounded-full; }
    </style>

    @stack('styles')
</head>

<body class="h-full bg-slate-50 text-slate-800 antialiased">

<div class="flex h-full min-h-screen">

    {{-- ═══════════════════════════════════════════════════════════════════
         SIDEBAR
    ══════════════════════════════════════════════════════════════════════ --}}
    <aside id="sidebar"
           class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200
                  flex flex-col transform transition-transform duration-300 ease-in-out
                  lg:translate-x-0 -translate-x-full lg:static lg:inset-auto">

        {{-- Logo / Brand --}}
        <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
            <div class="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <span class="material-icons-round text-white text-lg">school</span>
            </div>
            <div class="leading-tight">
                <p class="text-slate-800 font-semibold text-sm">ប្រព័ន្ធគ្រប់គ្រងសាលា</p>
                <p class="text-slate-400 text-xs">ផ្នែកគ្រូបង្រៀន</p>
            </div>
        </div>

        {{-- Navigation --}}
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">

            <p class="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">ភារកិច្ចគ្រូ</p>

            @php
                $navItems = [
                    ['route' => 'teacher.dashboard',          'icon' => 'dashboard',       'label' => 'ផ្ទាំងព័ត៌មានសង្ខេប'],
                    ['route' => 'teacher.classrooms.index',   'icon' => 'meeting_room',    'label' => 'ថ្នាក់របស់ខ្ញុំ'],
                    ['route' => 'teacher.attendance.index',   'icon' => 'fact_check',      'label' => 'វត្តមាន'],
                    ['route' => 'teacher.scores.index',       'icon' => 'grade',           'label' => 'ពិន្ទុ'],
                ];
            @endphp

            @foreach ($navItems as $item)
                <a href="{{ route($item['route']) }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                          {{ request()->routeIs($item['route']) ? 'nav-link-active' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }}">
                    <span class="material-icons-round text-[20px] flex-shrink-0
                                 {{ request()->routeIs($item['route']) ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600' }}">
                        {{ $item['icon'] }}
                    </span>
                    {{ $item['label'] }}
                </a>
            @endforeach

            <p class="px-3 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">របាយការណ៍</p>

            @php
                $reportItems = [
                    ['route' => 'teacher.attendance.student-report', 'icon' => 'person_search',  'label' => 'របាយការណ៍វត្តមានសិស្ស'],
                    ['route' => 'teacher.scores.annual-report',      'icon' => 'summarize',       'label' => 'របាយការណ៍ពិន្ទុប្រចាំឆ្នាំ'],
                ];
            @endphp

            @foreach ($reportItems as $item)
                <a href="{{ route($item['route']) }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                          {{ request()->routeIs($item['route']) ? 'nav-link-active' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }}">
                    <span class="material-icons-round text-[20px] flex-shrink-0
                                 {{ request()->routeIs($item['route']) ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600' }}">
                        {{ $item['icon'] }}
                    </span>
                    {{ $item['label'] }}
                </a>
            @endforeach

        </nav>

        {{-- User Footer --}}
        <div class="border-t border-slate-200 p-4">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="material-icons-round text-emerald-600 text-sm">person</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-800 truncate">{{ auth('teacher')->user()->name ?? 'គ្រូបង្រៀន' }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ auth('teacher')->user()->email ?? '' }}</p>
                </div>
                <form method="POST" action="{{ route('teacher.logout') }}">
                    @csrf
                    <button type="submit"
                            id="sidebar-logout-btn"
                            title="ចេញ"
                            class="text-slate-400 hover:text-red-500 transition-colors p-1">
                        <span class="material-icons-round text-[20px]">logout</span>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    {{-- Sidebar overlay for mobile --}}
    <div id="sidebar-overlay"
         class="fixed inset-0 bg-black/60 z-40 lg:hidden hidden"
         onclick="closeSidebar()"></div>

    {{-- ═══════════════════════════════════════════════════════════════════
         MAIN CONTENT AREA
    ══════════════════════════════════════════════════════════════════════ --}}
    <div class="flex-1 flex flex-col min-w-0 lg:ml-0">

        {{-- Top Bar --}}
        <header class="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3 flex items-center gap-4">

            {{-- Mobile menu toggle --}}
            <button onclick="openSidebar()"
                    class="lg:hidden text-slate-500 hover:text-slate-800 transition-colors p-1">
                <span class="material-icons-round">menu</span>
            </button>

            {{-- Breadcrumb --}}
            <div class="flex-1 min-w-0">
                <h1 class="text-base font-semibold text-slate-800 truncate">@yield('page-title', 'ផ្ទាំងព័ត៌មានសង្ខេប')</h1>
                @hasSection('breadcrumb')
                    <div class="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <a href="{{ route('teacher.dashboard') }}" class="hover:text-slate-600">ផ្ទាំងព័ត៌មានសង្ខេប</a>
                        <span class="material-icons-round text-[12px]">chevron_right</span>
                        @yield('breadcrumb')
                    </div>
                @endif
            </div>

            {{-- Right side actions --}}
            <div class="flex items-center gap-2">
                @yield('header-actions')
            </div>
        </header>

        {{-- Flash Messages --}}
        @if(session('success'))
            <div id="flash-success"
                 class="mx-4 sm:mx-6 mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200
                        text-emerald-700 rounded-xl px-4 py-3 text-sm shadow-sm">
                <span class="material-icons-round text-emerald-500 text-[20px] flex-shrink-0">check_circle</span>
                <span class="flex-1">{{ session('success') }}</span>
                <button onclick="document.getElementById('flash-success').remove()"
                        class="text-emerald-400 hover:text-emerald-600 transition-colors">
                    <span class="material-icons-round text-[18px]">close</span>
                </button>
            </div>
        @endif

        @if(session('error') || $errors->has('error'))
            <div id="flash-error"
                 class="mx-4 sm:mx-6 mt-4 flex items-center gap-3 bg-red-50 border border-red-200
                        text-red-700 rounded-xl px-4 py-3 text-sm shadow-sm">
                <span class="material-icons-round text-red-500 text-[20px] flex-shrink-0">error</span>
                <span class="flex-1">{{ session('error') ?? $errors->first('error') }}</span>
                <button onclick="document.getElementById('flash-error').remove()"
                        class="text-red-400 hover:text-red-600 transition-colors">
                    <span class="material-icons-round text-[18px]">close</span>
                </button>
            </div>
        @endif

        {{-- Page Content --}}
        <main class="flex-1 p-4 sm:p-6 page-content">
            @yield('content')
        </main>
    </div>
</div>

<script>
    // ── Sidebar (mobile) ──
    function openSidebar() {
        document.getElementById('sidebar').classList.replace('-translate-x-full', 'translate-x-0');
        document.getElementById('sidebar-overlay').classList.remove('hidden');
    }
    function closeSidebar() {
        document.getElementById('sidebar').classList.replace('translate-x-0', '-translate-x-full');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    }

    // ── Auto-dismiss flash messages after 4 seconds ──
    setTimeout(() => {
        ['flash-success', 'flash-error'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.transition = 'opacity 0.4s';
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 400);
            }
        });
    }, 4000);
</script>

@stack('scripts')
</body>
</html>
