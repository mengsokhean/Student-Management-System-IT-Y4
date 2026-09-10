@extends('layouts.admin')

@section('title', 'ប្រវត្តិរូប — ' . $student->name_en)
@section('page-title', 'ប្រវត្តិរូបសិស្ស')
@section('breadcrumb')
    <a href="{{ route('admin.students.index') }}" class="hover:text-gray-300">សិស្ស</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">{{ $student->name_en }}</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.students.index') }}"
       class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700
              hover:border-gray-600 text-gray-300 hover:text-white text-sm font-medium
              px-4 py-2 rounded-xl transition-all">
        <span class="material-icons-round text-[18px]">arrow_back</span>
        <span>ត្រឡប់ក្រោយ</span>
    </a>
    <a href="{{ route('admin.students.edit', $student) }}"
       class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700
              text-white text-sm font-medium px-4 py-2 rounded-xl transition-all
              shadow-lg shadow-brand-600/20">
        <span class="material-icons-round text-[18px]">edit</span>
        <span>កែប្រែ</span>
    </a>
@endsection

@section('content')

@php
    $activeClassrooms   = $student->classrooms->where('pivot.status', 'active');
    $activeClass        = $activeClassrooms->first();
    $historicClassrooms = $student->classrooms->where('pivot.status', '!=', 'active');

    $age = $student->date_of_birth
        ? \Carbon\Carbon::parse($student->date_of_birth)->age
        : null;
@endphp

<div class="max-w-4xl mx-auto space-y-5">

    {{-- ══════════════════════════════════════════════
         HERO HEADER
    ══════════════════════════════════════════════════ --}}
    <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {{-- Gender-coded top strip --}}
        <div class="h-1.5 w-full
                    {{ $student->gender === 'female'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600'
                        : 'bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600' }}">
        </div>

        <div class="px-6 py-6 sm:px-8">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">

                {{-- Avatar --}}
                <div class="relative flex-shrink-0">
                    <div class="w-20 h-20 rounded-2xl flex items-center justify-center
                                {{ $student->gender === 'female'
                                    ? 'bg-pink-950/70 border-2 border-pink-700/50'
                                    : 'bg-sky-950/70 border-2 border-sky-700/50' }}">
                        <span class="material-icons-round text-[40px]
                                     {{ $student->gender === 'female' ? 'text-pink-400' : 'text-sky-400' }}">
                            {{ $student->gender === 'female' ? 'face_3' : 'face' }}
                        </span>
                    </div>
                    {{-- Enrollment status dot --}}
                    @if($activeClass)
                        <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full
                                     border-2 border-gray-900 flex items-center justify-center">
                            <span class="w-2 h-2 bg-white rounded-full animate-ping opacity-75 absolute"></span>
                            <span class="w-1.5 h-1.5 bg-white rounded-full relative"></span>
                        </span>
                    @else
                        <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full
                                     border-2 border-gray-900 flex items-center justify-center">
                            <span class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        </span>
                    @endif
                </div>

                {{-- Identity --}}
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                        <h1 class="text-xl font-bold text-white">{{ $student->name_kh }}</h1>
                        @if($activeClass)
                            <span class="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/50
                                         text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                រៀននៅ {{ $activeClass->name }}
                            </span>
                        @else
                            <span class="inline-flex items-center gap-1 bg-gray-800 border border-gray-700
                                         text-gray-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                មិនទាន់ចុះឈ្មោះ
                            </span>
                        @endif
                    </div>
                    <p class="text-gray-400 text-sm mb-3">{{ $student->name_en }}</p>

                    <div class="flex flex-wrap items-center gap-2">
                        {{-- Student Code --}}
                        <span class="inline-flex items-center gap-1.5 bg-rose-950/50 border border-rose-800/40
                                     text-rose-400 font-mono text-xs px-3 py-1.5 rounded-lg">
                            <span class="material-icons-round text-[14px]">badge</span>
                            {{ $student->student_code }}
                        </span>
                        {{-- Gender --}}
                        <span class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium
                                     {{ $student->gender === 'female'
                                        ? 'bg-pink-950/50 border border-pink-800/40 text-pink-400'
                                        : 'bg-sky-950/50 border border-sky-800/40 text-sky-400' }}">
                            <span class="material-icons-round text-[14px]">{{ $student->gender === 'female' ? 'female' : 'male' }}</span>
                            {{ $student->gender === 'female' ? 'ស្រី' : 'ប្រុស' }}
                        </span>
                        {{-- Age --}}
                        @if($age)
                            <span class="inline-flex items-center gap-1.5 bg-gray-800 border border-gray-700
                                         text-gray-400 text-xs px-3 py-1.5 rounded-lg">
                                <span class="material-icons-round text-[14px]">cake</span>
                                {{ $age }} ឆ្នាំ
                            </span>
                        @endif
                    </div>
                </div>

                {{-- Quick actions --}}
                <div class="hidden sm:flex flex-col gap-2 flex-shrink-0">
                    <a href="{{ route('admin.students.edit', $student) }}"
                       class="inline-flex items-center gap-2 bg-brand-600/20 hover:bg-brand-600/40
                              border border-brand-700/50 text-brand-400 hover:text-brand-300
                              text-xs font-medium px-3 py-2 rounded-xl transition-all">
                        <span class="material-icons-round text-[16px]">edit</span>
                        កែប្រែ
                    </a>
                    <button type="button"
                            onclick="openDeleteModal(
                                '{{ route('admin.students.destroy', $student) }}',
                                'តើអ្នកពិតជាចង់លុបសិស្ស {{ addslashes($student->name_en) }} មែនទេ?'
                            )"
                            class="inline-flex items-center gap-2 bg-red-950/20 hover:bg-red-950/50
                                   border border-red-800/40 text-red-500 hover:text-red-400
                                   text-xs font-medium px-3 py-2 rounded-xl transition-all">
                        <span class="material-icons-round text-[16px]">delete</span>
                        លុប
                    </button>
                </div>
            </div>
        </div>
    </div>

    {{-- ══════════════════════════════════════════════
         TWO-COLUMN: Personal Details + Enrollment
    ══════════════════════════════════════════════════ --}}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {{-- Card 1: Personal Details --}}
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div class="flex items-center gap-2 mb-5">
                <span class="material-icons-round text-brand-400 text-[18px]">contact_page</span>
                <h2 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
            </div>
            <dl class="space-y-4">

                {{-- DOB --}}
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-icons-round text-gray-400 text-[16px]">cake</span>
                    </div>
                    <div>
                        <dt class="text-xs text-gray-500 mb-0.5">ថ្ងៃខែឆ្នាំកំណើត</dt>
                        <dd class="text-sm text-white font-medium">
                            {{ $student->date_of_birth
                                ? \Carbon\Carbon::parse($student->date_of_birth)->format('d M Y')
                                : '—' }}
                            @if($age)
                                <span class="text-gray-500 font-normal">({{ $age }} ឆ្នាំ)</span>
                            @endif
                        </dd>
                    </div>
                </div>

                {{-- Address --}}
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-icons-round text-gray-400 text-[16px]">home</span>
                    </div>
                    <div>
                        <dt class="text-xs text-gray-500 mb-0.5">អាសយដ្ឋាន</dt>
                        <dd class="text-sm text-white font-medium">{{ $student->address ?? '—' }}</dd>
                    </div>
                </div>

                {{-- Personal Phone --}}
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-icons-round text-gray-400 text-[16px]">smartphone</span>
                    </div>
                    <div>
                        <dt class="text-xs text-gray-500 mb-0.5">ទូរស័ព្ទផ្ទាល់ខ្លួន</dt>
                        <dd class="text-sm text-white font-medium font-mono">{{ $student->phone ?? '—' }}</dd>
                    </div>
                </div>

                <div class="border-t border-gray-800 my-1"></div>

                {{-- Guardian Name --}}
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-icons-round text-gray-400 text-[16px]">supervisor_account</span>
                    </div>
                    <div>
                        <dt class="text-xs text-gray-500 mb-0.5">ឈ្មោះអ្នកឃ្វាល</dt>
                        <dd class="text-sm text-white font-medium">{{ $student->guardian_name ?? '—' }}</dd>
                    </div>
                </div>

                {{-- Guardian Phone (with amber public key indicator) --}}
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-amber-950/50 border border-amber-800/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-icons-round text-amber-400 text-[16px]">phone</span>
                    </div>
                    <div>
                        <dt class="text-xs text-gray-500 mb-0.5 flex items-center gap-1.5">
                            ទូរស័ព្ទអ្នកឃ្វាល
                            <span class="inline-flex items-center gap-0.5 bg-amber-950/50 border border-amber-800/40
                                         text-amber-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                <span class="material-icons-round text-[9px]">public</span>
                                Public Search Key
                            </span>
                        </dt>
                        <dd class="text-sm text-white font-semibold font-mono">{{ $student->guardian_phone ?? '—' }}</dd>
                    </div>
                </div>

                {{-- Portal Account --}}
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="material-icons-round text-gray-400 text-[16px]">manage_accounts</span>
                    </div>
                    <div>
                        <dt class="text-xs text-gray-500 mb-0.5">គណនី Portal</dt>
                        <dd>
                            @if($student->user)
                                <div>
                                    <p class="text-sm text-white font-medium">{{ $student->user->email }}</p>
                                    @if($student->user->is_active)
                                        <span class="mt-1 inline-flex items-center gap-1 bg-emerald-950/50 border border-emerald-800/40
                                                     text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                                            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                            សកម្ម
                                        </span>
                                    @endif
                                </div>
                            @else
                                <span class="text-gray-600 text-sm italic">គ្មានគណនី Portal</span>
                            @endif
                        </dd>
                    </div>
                </div>

            </dl>
        </div>

        {{-- Card 2: Current Enrollment --}}
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div class="flex items-center gap-2 mb-5">
                <span class="material-icons-round text-emerald-400 text-[18px]">assignment_ind</span>
                <h2 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ការចុះឈ្មោះបច្ចុប្បន្ន</h2>
                @if($activeClass)
                    <span class="ml-auto bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-xs
                                 px-2 py-0.5 rounded-full font-medium">
                        សកម្ម
                    </span>
                @endif
            </div>

            @if($activeClass)
                {{-- Active enrollment hero --}}
                <div class="bg-gradient-to-br from-emerald-950/40 to-gray-800/20
                            border border-emerald-800/30 rounded-xl p-4 mb-4">
                    <div class="flex items-center gap-3 mb-3">
                        {{-- Track-coded class chip --}}
                        <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center
                                    font-bold text-lg
                                    @if($activeClass->track === 'science') bg-teal-950/70 border border-teal-700/50 text-teal-300
                                    @elseif($activeClass->track === 'social_science') bg-amber-950/70 border border-amber-700/50 text-amber-300
                                    @else bg-sky-950/70 border border-sky-700/50 text-sky-300 @endif">
                            {{ $activeClass->grade?->level }}
                        </div>
                        <div>
                            <p class="text-xl font-bold text-white">{{ $activeClass->name }}</p>
                            <p class="text-xs text-gray-400">{{ $activeClass->academicYear?->name ?? '—' }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        {{-- Grade --}}
                        <div class="bg-gray-800/60 rounded-lg px-3 py-2">
                            <p class="text-[10px] text-gray-500 mb-0.5">ថ្នាក់ទី</p>
                            <p class="text-sm font-semibold text-white">ទី {{ $activeClass->grade?->level }}</p>
                        </div>

                        {{-- Track --}}
                        <div class="bg-gray-800/60 rounded-lg px-3 py-2">
                            <p class="text-[10px] text-gray-500 mb-0.5">ផ្លូវវិជ្ជា</p>
                            @if($activeClass->track === 'science')
                                <span class="inline-flex items-center gap-1 text-teal-300 text-sm font-semibold">
                                    <span class="material-icons-round text-[14px]">science</span>
                                    វិទ្យាសាស្ត្រ
                                </span>
                            @elseif($activeClass->track === 'social_science')
                                <span class="inline-flex items-center gap-1 text-amber-300 text-sm font-semibold">
                                    <span class="material-icons-round text-[14px]">account_balance</span>
                                    វិទ្យាសាស្ត្រសង្គម
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 text-sky-300 text-sm font-semibold">
                                    <span class="material-icons-round text-[14px]">menu_book</span>
                                    ទូទៅ
                                </span>
                            @endif
                        </div>

                        {{-- Enrolled At --}}
                        <div class="bg-gray-800/60 rounded-lg px-3 py-2">
                            <p class="text-[10px] text-gray-500 mb-0.5">ថ្ងៃចុះឈ្មោះ</p>
                            <p class="text-sm font-semibold text-white">
                                {{ $activeClass->pivot->enrolled_at
                                    ? \Carbon\Carbon::parse($activeClass->pivot->enrolled_at)->format('d M Y')
                                    : '—' }}
                            </p>
                        </div>

                        {{-- Homeroom Teacher --}}
                        <div class="bg-gray-800/60 rounded-lg px-3 py-2">
                            <p class="text-[10px] text-gray-500 mb-0.5">គ្រូអាណាព្យាបាល</p>
                            @php $ht = $activeClass->homeroomTeacher?->teacherProfile; @endphp
                            @if($ht)
                                <p class="text-sm font-semibold text-white truncate">{{ $ht->name_en }}</p>
                            @else
                                <p class="text-sm text-gray-600 italic">—</p>
                            @endif
                        </div>
                    </div>
                </div>

                {{-- Enrollment status badge --}}
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">ស្ថានភាពការចុះឈ្មោះ</span>
                    <span class="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/50
                                 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold">
                        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        {{ ucfirst($activeClass->pivot->status) }}
                    </span>
                </div>

            @else
                {{-- Not enrolled empty state --}}
                <div class="flex flex-col items-center justify-center gap-3 py-10 text-center">
                    <div class="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                        <span class="material-icons-round text-gray-500 text-3xl">assignment_ind</span>
                    </div>
                    <p class="text-gray-400 font-medium text-sm">មិនទាន់ចុះឈ្មោះ</p>
                    <p class="text-gray-600 text-xs">សិស្សនេះមិនទាន់ចូលថ្នាក់ណាមួយទេ</p>
                </div>
            @endif

            {{-- Historic enrollments (collapsed) --}}
            @if($historicClassrooms->isNotEmpty())
                <div class="mt-4 pt-4 border-t border-gray-800">
                    <p class="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">ប្រវត្តិការចុះឈ្មោះ</p>
                    <div class="space-y-2">
                        @foreach($historicClassrooms as $hClass)
                            <div class="flex items-center justify-between bg-gray-800/50 rounded-xl px-3 py-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-400 font-medium">{{ $hClass->name }}</span>
                                    <span class="text-xs text-gray-600">· {{ $hClass->academicYear?->name }}</span>
                                </div>
                                <span class="text-xs px-2 py-0.5 rounded-full font-medium
                                             @if($hClass->pivot->status === 'graduated') bg-brand-950/60 border border-brand-800/40 text-brand-400
                                             @elseif($hClass->pivot->status === 'transferred') bg-sky-950/60 border border-sky-800/40 text-sky-400
                                             @else bg-gray-800 border border-gray-700 text-gray-500 @endif">
                                    @if($hClass->pivot->status === 'graduated') បញ្ចប់ការសិក្សា
                                    @elseif($hClass->pivot->status === 'transferred') ផ្ទេររៀន
                                    @else បោះបង់ @endif
                                </span>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>

    </div>

    {{-- Metadata Footer --}}
    <div class="bg-gray-900/50 border border-gray-800/50 rounded-2xl px-5 py-4
                flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
                <span class="material-icons-round text-[14px]">add_circle_outline</span>
                ចុះឈ្មោះ {{ $student->created_at?->diffForHumans() ?? '—' }}
            </span>
            <span class="text-gray-700">·</span>
            <span class="flex items-center gap-1.5">
                <span class="material-icons-round text-[14px]">update</span>
                កែប្រែ {{ $student->updated_at?->diffForHumans() ?? '—' }}
            </span>
        </div>
        <a href="{{ route('admin.students.edit', $student) }}"
           class="text-brand-400 hover:text-brand-300 transition-colors font-medium flex items-center gap-1">
            <span class="material-icons-round text-[14px]">edit</span>
            កែប្រែ
        </a>
    </div>

</div>

@endsection
