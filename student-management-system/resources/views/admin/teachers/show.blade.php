@extends('layouts.admin')

@section('title', 'ប្រវត្តិរូប — ' . $teacher->name_en)
@section('page-title', 'ប្រវត្តិរូបគ្រូបង្រៀន')
@section('breadcrumb')
    <a href="{{ route('admin.teachers.index') }}" class="hover:text-gray-300">គ្រូបង្រៀន</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">{{ $teacher->name_en }}</span>
@endsection

@section('header-actions')
    <a href="{{ route('admin.teachers.index') }}"
       id="btn-back-to-teachers"
       class="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700
              hover:border-gray-600 text-gray-300 hover:text-white text-sm font-medium
              px-4 py-2 rounded-xl transition-all duration-150">
        <span class="material-icons-round text-[18px]">arrow_back</span>
        <span>ត្រឡប់ក្រោយ</span>
    </a>
    <a href="{{ route('admin.teachers.edit', $teacher) }}"
       id="btn-edit-teacher"
       class="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm
              font-medium px-4 py-2 rounded-xl transition-all duration-150
              shadow-lg shadow-brand-600/20">
        <span class="material-icons-round text-[18px]">edit</span>
        <span>កែប្រែ</span>
    </a>
@endsection

@section('content')

<div class="max-w-4xl mx-auto space-y-5">

    {{-- ══════════════════════════════════════════════════════════════
         HERO HEADER — Avatar / Name / Code / Status
    ══════════════════════════════════════════════════════════════════ --}}
    <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

        {{-- Decorative top strip --}}
        <div class="h-1.5 w-full
                    {{ $teacher->gender === 'female'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600'
                        : 'bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600' }}">
        </div>

        <div class="px-6 py-6 sm:px-8">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">

                {{-- Large Avatar --}}
                <div class="relative flex-shrink-0">
                    <div class="w-20 h-20 rounded-2xl flex items-center justify-center
                                {{ $teacher->gender === 'female'
                                    ? 'bg-pink-950/70 border-2 border-pink-700/50'
                                    : 'bg-sky-950/70 border-2 border-sky-700/50' }}">
                        <span class="material-icons-round text-[40px]
                                     {{ $teacher->gender === 'female' ? 'text-pink-400' : 'text-sky-400' }}">
                            {{ $teacher->gender === 'female' ? 'face_3' : 'face' }}
                        </span>
                    </div>
                    {{-- Active/Inactive dot --}}
                    @if($teacher->user?->is_active)
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
                        <h1 class="text-xl font-bold text-white">{{ $teacher->name_kh }}</h1>
                        @if($teacher->user?->is_active)
                            <span class="inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-700/50
                                         text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                សកម្ម
                            </span>
                        @else
                            <span class="inline-flex items-center gap-1 bg-gray-800 border border-gray-700
                                         text-gray-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                អសកម្ម
                            </span>
                        @endif
                    </div>

                    <p class="text-gray-400 text-sm mb-3">{{ $teacher->name_en }}</p>

                    <div class="flex flex-wrap items-center gap-3">
                        {{-- Teacher Code --}}
                        <span class="inline-flex items-center gap-1.5 bg-amber-950/50 border border-amber-800/40
                                     text-amber-400 font-mono text-xs px-3 py-1.5 rounded-lg">
                            <span class="material-icons-round text-[14px]">badge</span>
                            {{ $teacher->teacher_code }}
                        </span>
                        {{-- Gender --}}
                        <span class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium
                                     {{ $teacher->gender === 'female'
                                        ? 'bg-pink-950/50 border border-pink-800/40 text-pink-400'
                                        : 'bg-sky-950/50 border border-sky-800/40 text-sky-400' }}">
                            <span class="material-icons-round text-[14px]">
                                {{ $teacher->gender === 'female' ? 'female' : 'male' }}
                            </span>
                            {{ $teacher->gender === 'female' ? 'ស្រី' : 'ប្រុស' }}
                        </span>
                        {{-- Member since --}}
                        <span class="inline-flex items-center gap-1.5 bg-gray-800 border border-gray-700
                                     text-gray-400 text-xs px-3 py-1.5 rounded-lg">
                            <span class="material-icons-round text-[14px]">calendar_today</span>
                            ចូលក្រុមតាំងពី {{ $teacher->created_at?->format('d M Y') ?? '—' }}
                        </span>
                    </div>
                </div>

                {{-- Quick action on desktop --}}
                <div class="hidden sm:flex flex-col gap-2 flex-shrink-0">
                    <a href="{{ route('admin.teachers.edit', $teacher) }}"
                       class="inline-flex items-center gap-2 bg-brand-600/20 hover:bg-brand-600/40
                              border border-brand-700/50 text-brand-400 hover:text-brand-300
                              text-xs font-medium px-3 py-2 rounded-xl transition-all">
                        <span class="material-icons-round text-[16px]">edit</span>
                        កែប្រែ
                    </a>
                    <button type="button"
                            onclick="openDeleteModal(
                                '{{ route('admin.teachers.destroy', $teacher) }}',
                                'តើអ្នកពិតជាចង់លុប {{ addslashes($teacher->name_en) }} មែនទេ?'
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

    {{-- ══════════════════════════════════════════════════════════════
         TWO-COLUMN DETAIL + ASSIGNMENT GRID
    ══════════════════════════════════════════════════════════════════ --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {{-- ── LEFT: Contact Details ── --}}
        <div class="lg:col-span-1 space-y-5">

            {{-- Contact Card --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div class="flex items-center gap-2 mb-4">
                    <span class="material-icons-round text-brand-400 text-[18px]">contacts</span>
                    <h2 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ព័ត៌មានទំនាក់ទំនង</h2>
                </div>

                <dl class="space-y-4">

                    {{-- Phone --}}
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span class="material-icons-round text-gray-400 text-[16px]">phone</span>
                        </div>
                        <div class="min-w-0">
                            <dt class="text-xs text-gray-500 mb-0.5">លេខទូរស័ព្ទ</dt>
                            <dd class="text-sm text-white font-medium">
                                {{ $teacher->phone ?? '—' }}
                            </dd>
                        </div>
                    </div>

                    {{-- Email --}}
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span class="material-icons-round text-gray-400 text-[16px]">email</span>
                        </div>
                        <div class="min-w-0">
                            <dt class="text-xs text-gray-500 mb-0.5">អ៊ីម៉ែលចូលប្រព័ន្ធ</dt>
                            <dd class="text-sm text-white font-medium truncate">
                                {{ $teacher->user?->email ?? '—' }}
                            </dd>
                        </div>
                    </div>

                    {{-- Account Status --}}
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span class="material-icons-round text-gray-400 text-[16px]">manage_accounts</span>
                        </div>
                        <div class="min-w-0">
                            <dt class="text-xs text-gray-500 mb-0.5">ស្ថានភាពគណនី</dt>
                            <dd>
                                @if($teacher->user?->is_active)
                                    <span class="inline-flex items-center gap-1 bg-emerald-950/50 border border-emerald-800/40
                                                 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                        សកម្ម
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 bg-gray-800 border border-gray-700
                                                 text-gray-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                        អសកម្ម
                                    </span>
                                @endif
                            </dd>
                        </div>
                    </div>

                    {{-- Gender --}}
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span class="material-icons-round text-gray-400 text-[16px]">wc</span>
                        </div>
                        <div class="min-w-0">
                            <dt class="text-xs text-gray-500 mb-0.5">ភេទ</dt>
                            <dd class="text-sm text-white font-medium">
                                {{ $teacher->gender === 'female' ? 'ស្រី' : 'ប្រុស' }}
                            </dd>
                        </div>
                    </div>

                </dl>
            </div>

            {{-- Homeroom Class Card --}}
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div class="flex items-center gap-2 mb-4">
                    <span class="material-icons-round text-emerald-400 text-[18px]">home_work</span>
                    <h2 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">ថ្នាក់អាណាព្យាបាល</h2>
                </div>

                @if($teacher->homeroomClassroom?->classroom)
                    @php $hroom = $teacher->homeroomClassroom->classroom; @endphp
                    <div class="flex items-center gap-3 bg-emerald-950/30 border border-emerald-800/30
                                rounded-xl px-4 py-3">
                        <div class="w-9 h-9 bg-emerald-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span class="material-icons-round text-emerald-400 text-[18px]">meeting_room</span>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-white">{{ $hroom->name }}</p>
                            <p class="text-xs text-emerald-400">{{ $hroom->grade?->name ?? '—' }}</p>
                        </div>
                    </div>
                @else
                    <div class="flex flex-col items-center gap-2 py-4 text-center">
                        <span class="material-icons-round text-gray-600 text-3xl">home_work</span>
                        <p class="text-xs text-gray-500">មិនទាន់ចាត់តាំងទេ</p>
                    </div>
                @endif
            </div>

        </div>

        {{-- ── RIGHT: Assigned Subjects ── --}}
        <div class="lg:col-span-2">
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-full">
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center gap-2">
                        <span class="material-icons-round text-brand-400 text-[18px]">menu_book</span>
                        <h2 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">មុខវិជ្ជា & ថ្នាក់រៀន</h2>
                    </div>
                    @if($teacher->teacherClassSubjects->count() > 0)
                        <span class="bg-brand-950/60 border border-brand-800/40 text-brand-400
                                     text-xs px-2.5 py-0.5 rounded-full font-medium">
                            {{ $teacher->teacherClassSubjects->count() }} មុខ
                        </span>
                    @endif
                </div>

                @if($teacher->teacherClassSubjects->count() > 0)
                    <div class="space-y-2">
                        @foreach($teacher->teacherClassSubjects as $assignment)
                            <div class="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800
                                        border border-gray-700/50 hover:border-gray-700
                                        rounded-xl px-4 py-3 transition-colors group">

                                {{-- Subject color dot --}}
                                <div class="w-8 h-8 bg-brand-950/60 border border-brand-800/40
                                            rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="material-icons-round text-brand-400 text-[16px]">book</span>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-white truncate">
                                        {{ $assignment->subject?->name_kh ?? '—' }}
                                    </p>
                                    <p class="text-xs text-gray-400 truncate">
                                        {{ $assignment->subject?->name_en ?? '' }}
                                        @if($assignment->subject?->code)
                                            <span class="text-gray-600">·</span>
                                            <span class="font-mono">{{ $assignment->subject->code }}</span>
                                        @endif
                                    </p>
                                </div>

                                {{-- Classroom chip --}}
                                @if($assignment->classroom)
                                    <span class="flex-shrink-0 inline-flex items-center gap-1
                                                 bg-gray-700 border border-gray-600 text-gray-300
                                                 text-xs px-2.5 py-1 rounded-lg font-medium">
                                        <span class="material-icons-round text-[12px] text-gray-500">meeting_room</span>
                                        {{ $assignment->classroom->name }}
                                    </span>
                                @endif
                            </div>
                        @endforeach
                    </div>

                    {{-- Summary footer --}}
                    <div class="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                        <p class="text-xs text-gray-500">
                            ចំនួនថ្នាក់ / មុខវិជ្ជា ដែលបានចាត់តាំង
                        </p>
                        <span class="text-xs text-gray-400 font-medium">
                            {{ $teacher->teacherClassSubjects->pluck('classroom_id')->unique()->count() }} ថ្នាក់ ·
                            {{ $teacher->teacherClassSubjects->pluck('subject_id')->unique()->count() }} មុខវិជ្ជា
                        </span>
                    </div>

                @else
                    {{-- Empty state --}}
                    <div class="flex flex-col items-center justify-center gap-3 py-12 text-center">
                        <div class="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                            <span class="material-icons-round text-gray-600 text-3xl">menu_book</span>
                        </div>
                        <div>
                            <p class="text-gray-400 font-medium text-sm">មិនទាន់មានការចាត់តាំងទេ</p>
                            <p class="text-gray-600 text-xs mt-1">
                                មុខវិជ្ជា និងថ្នាក់រៀននឹងបង្ហាញនៅទីនេះ
                                បន្ទាប់ពីការចាត់តាំង
                            </p>
                        </div>
                        {{-- Placeholder assign button (wired later) --}}
                        <button type="button"
                                disabled
                                class="mt-2 inline-flex items-center gap-2 bg-gray-800 border border-gray-700
                                       text-gray-500 text-xs font-medium px-4 py-2 rounded-xl cursor-not-allowed">
                            <span class="material-icons-round text-[14px]">add</span>
                            ចាត់តាំងមុខវិជ្ជា
                            <span class="bg-gray-700 text-gray-500 text-[10px] px-1.5 py-0.5 rounded">មកដល់ឆាប់ៗ</span>
                        </button>
                    </div>
                @endif
            </div>
        </div>

    </div>

    {{-- ══════════════════════════════════════════════════════════════
         METADATA FOOTER
    ══════════════════════════════════════════════════════════════════ --}}
    <div class="bg-gray-900/50 border border-gray-800/50 rounded-2xl px-5 py-4
                flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
                <span class="material-icons-round text-[14px]">add_circle_outline</span>
                បានបង្កើត {{ $teacher->created_at?->diffForHumans() ?? '—' }}
            </span>
            <span class="text-gray-700">·</span>
            <span class="flex items-center gap-1.5">
                <span class="material-icons-round text-[14px]">update</span>
                កែប្រែចុងក្រោយ {{ $teacher->updated_at?->diffForHumans() ?? '—' }}
            </span>
        </div>
        <div class="flex items-center gap-2">
            <a href="{{ route('admin.teachers.edit', $teacher) }}"
               class="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors font-medium">
                <span class="material-icons-round text-[14px]">edit</span>
                កែប្រែ
            </a>
        </div>
    </div>

</div>

@endsection
