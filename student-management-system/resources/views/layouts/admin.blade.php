<!DOCTYPE html>
<html lang="km" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'ប្រព័ន្ធគ្រប់គ្រងសាលា') — ផ្នែករដ្ឋបាល</title>

    {{-- Google Fonts: Kantumruy Pro (Khmer) + Inter (Latin) --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    {{-- Google Material Icons --}}
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">

    {{-- Tailwind CSS CDN --}}
    <script src="https://cdn.tailwindcss.com"></script>

    {{-- SweetAlert2 --}}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Kantumruy Pro', 'Inter', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50:  '#eef2ff',
                            100: '#e0e7ff',
                            200: '#c7d2fe',
                            400: '#818cf8',
                            500: '#6366f1',
                            600: '#4f46e5',
                            700: '#4338ca',
                            800: '#3730a3',
                            900: '#312e81',
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
            @apply bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-semibold;
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
            <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <span class="material-icons-round text-white text-lg">school</span>
            </div>
            <div class="leading-tight">
                <p class="text-slate-800 font-semibold text-sm">ប្រព័ន្ធគ្រប់គ្រងសាលា</p>
                <p class="text-slate-400 text-xs">ផ្នែករដ្ឋបាល</p>
            </div>
        </div>

        {{-- Navigation --}}
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">

            <p class="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">គ្រប់គ្រងទូទៅ</p>

            @php
                $navItems = [
                    ['route' => 'admin.dashboard',           'icon' => 'dashboard',      'label' => 'ផ្ទាំងព័ត៌មានសង្ខេប'],
                    ['route' => 'admin.academic-years.index','icon' => 'calendar_today',  'label' => 'ឆ្នាំសិក្សា'],
                    ['route' => 'admin.grades.index',        'icon' => 'layers',          'label' => 'កម្រិតថ្នាក់'],
                    ['route' => 'admin.subjects.index',      'icon' => 'menu_book',       'label' => 'មុខវិជ្ជា'],
                    ['route' => 'admin.classrooms.index',    'icon' => 'meeting_room',    'label' => 'ថ្នាក់រៀន'],
                    ['route' => 'admin.articles.index',      'icon' => 'article',         'label' => 'ព័ត៌មាន & ជូនដំណឹង'],
                ];
            @endphp

            @foreach ($navItems as $item)
                <a href="{{ route($item['route']) }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                          {{ request()->routeIs($item['route']) ? 'nav-link-active' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }}">
                    <span class="material-icons-round text-[20px] flex-shrink-0
                                 {{ request()->routeIs($item['route']) ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600' }}">
                        {{ $item['icon'] }}
                    </span>
                    {{ $item['label'] }}
                </a>
            @endforeach

            <p class="px-3 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">បុគ្គលិក & សិស្ស</p>

            @php
                $peopleItems = [
                    ['route' => 'admin.teachers.index',  'icon' => 'person',          'label' => 'គ្រូបង្រៀន'],
                    ['route' => 'admin.students.index',  'icon' => 'groups',          'label' => 'សិស្ស'],
                    ['route' => 'admin.enrollment.index','icon' => 'assignment_ind',  'label' => 'ការចុះឈ្មោះចូលរៀន'],
                ];
            @endphp

            @foreach ($peopleItems as $item)
                <a href="{{ route($item['route']) }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                          {{ request()->routeIs(rtrim($item['route'], '.index') . '*') ? 'nav-link-active' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }}">
                    <span class="material-icons-round text-[20px] flex-shrink-0
                                 {{ request()->routeIs(rtrim($item['route'], '.index') . '*') ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600' }}">
                        {{ $item['icon'] }}
                    </span>
                    {{ $item['label'] }}
                </a>
            @endforeach

            <p class="px-3 pt-4 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">ប្រព័ន្ធ</p>

            @php
                $systemItems = [
                    ['route' => 'admin.logs.index',  'icon' => 'receipt_long',  'label' => 'កំណត់ត្រាសកម្មភាព'],
                ];
            @endphp

            @foreach ($systemItems as $item)
                <a href="{{ route($item['route']) }}"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                          {{ request()->routeIs($item['route']) ? 'nav-link-active' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' }}">
                    <span class="material-icons-round text-[20px] flex-shrink-0
                                 {{ request()->routeIs($item['route']) ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600' }}">
                        {{ $item['icon'] }}
                    </span>
                    {{ $item['label'] }}
                </a>
            @endforeach

        </nav>

        {{-- User Footer --}}
        <div class="border-t border-slate-200 p-4">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="material-icons-round text-indigo-600 text-sm">person</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-800 truncate">{{ auth('admin')->user()->name ?? 'អ្នកគ្រប់គ្រង' }}</p>
                    <p class="text-xs text-slate-400 truncate">{{ auth('admin')->user()->email ?? '' }}</p>
                </div>
                <form method="POST" action="{{ route('admin.logout') }}">
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
                        <a href="{{ route('admin.dashboard') }}" class="hover:text-slate-600">ផ្ទាំងព័ត៌មានសង្ខេប</a>
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

        {{-- Header Ends --}}

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

    // ── SweetAlert2 Global Delete Confirmation ──
    function openDeleteModal(actionUrl, message) {
        Swal.fire({
            title: 'បញ្ជាក់ការលុប?',
            text: message || 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'បាទ/ចាស, លុបចោល!',
            cancelButtonText: 'បោះបង់',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl font-sans',
                confirmButton: 'rounded-xl px-5 py-2.5 font-medium shadow-md',
                cancelButton: 'rounded-xl px-5 py-2.5 font-medium'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = actionUrl;

                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (csrfToken) {
                    const tokenInput = document.createElement('input');
                    tokenInput.type = 'hidden';
                    tokenInput.name = '_token';
                    tokenInput.value = csrfToken;
                    form.appendChild(tokenInput);
                }

                const methodInput = document.createElement('input');
                methodInput.type = 'hidden';
                methodInput.name = '_method';
                methodInput.value = 'DELETE';
                form.appendChild(methodInput);

                document.body.appendChild(form);
                form.submit();
            }
        });
    }

    // ── SweetAlert2 Flash Feedback (Success & Error) ──
    document.addEventListener('DOMContentLoaded', function() {
        @if(session('success'))
            Swal.fire({
                icon: 'success',
                title: 'ជោគជ័យ!',
                text: {!! json_encode(session('success')) !!},
                timer: 3500,
                timerProgressBar: true,
                confirmButtonColor: '#4f46e5',
                confirmButtonText: 'យល់ព្រម',
                customClass: {
                    popup: 'rounded-2xl font-sans',
                    confirmButton: 'rounded-xl px-5 py-2.5 font-medium shadow-md'
                }
            });
        @endif

        @if(session('error'))
            Swal.fire({
                icon: 'error',
                title: 'មានបញ្ហា!',
                text: {!! json_encode(session('error')) !!},
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'យល់ព្រម',
                customClass: {
                    popup: 'rounded-2xl font-sans',
                    confirmButton: 'rounded-xl px-5 py-2.5 font-medium shadow-md'
                }
            });
        @elseif($errors->any())
            let errorHtml = '<div class="text-left text-sm space-y-1.5 mt-2 text-slate-600">';
            @foreach($errors->all() as $error)
                errorHtml += '<div class="flex items-start gap-2"><span class="material-icons-round text-red-500 text-[18px] flex-shrink-0 mt-0.5">error_outline</span><span>' + {!! json_encode($error) !!} + '</span></div>';
            @endforeach
            errorHtml += '</div>';

            Swal.fire({
                icon: 'error',
                title: 'មានបញ្ហា!',
                html: errorHtml,
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'យល់ព្រម',
                customClass: {
                    popup: 'rounded-2xl font-sans',
                    confirmButton: 'rounded-xl px-5 py-2.5 font-medium shadow-md'
                }
            });
        @endif

        // Global handler to replace any remaining plain window.confirm on form submits
        document.querySelectorAll('form[data-confirm]').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const msg = form.getAttribute('data-confirm') || 'តើអ្នកប្រាកដជាចង់បន្តសកម្មភាពនេះទេ?';
                Swal.fire({
                    title: 'បញ្ជាក់សកម្មភាព?',
                    text: msg,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#4f46e5',
                    cancelButtonColor: '#64748b',
                    confirmButtonText: 'យល់ព្រម',
                    cancelButtonText: 'បោះបង់',
                    reverseButtons: true,
                    customClass: {
                        popup: 'rounded-2xl font-sans',
                        confirmButton: 'rounded-xl px-5 py-2.5 font-medium shadow-md',
                        cancelButton: 'rounded-xl px-5 py-2.5 font-medium'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.removeAttribute('data-confirm');
                        form.submit();
                    }
                });
            });
        });
    });
</script>

@stack('scripts')
</body>
</html>
