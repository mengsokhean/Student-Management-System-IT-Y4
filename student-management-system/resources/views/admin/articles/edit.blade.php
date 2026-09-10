@extends('layouts.admin')

@section('title', 'កែប្រែអត្ថបទ')
@section('page-title', 'កែប្រែអត្ថបទ')
@section('breadcrumb')
    <a href="{{ route('admin.articles.index') }}" class="hover:text-gray-300">ព័ត៌មាន & ជូនដំណឹង</a>
    <span class="material-icons-round text-[12px]">chevron_right</span>
    <span class="text-gray-300">កែប្រែ</span>
@endsection

@section('content')

<div class="max-w-3xl mx-auto">
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {{-- Card Header --}}
        <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50/60">
            <div class="w-11 h-11 bg-indigo-100 border border-indigo-200 rounded-xl
                        flex items-center justify-center flex-shrink-0">
                <span class="material-icons-round text-indigo-600 text-[22px]">edit_note</span>
            </div>
            <div>
                <h2 class="font-semibold text-slate-800">កែប្រែអត្ថបទ</h2>
                <p class="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{{ $article->title }}</p>
            </div>
        </div>

        <form method="POST"
              action="{{ route('admin.articles.update', $article) }}"
              enctype="multipart/form-data"
              id="form-edit-article"
              class="p-6 space-y-6">
            @csrf
            @method('PUT')

            {{-- ── Article Type ── --}}
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">
                    ប្រភេទអត្ថបទ <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                    <label for="type_news"
                           class="relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                                  transition-all duration-150 group
                                  has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50
                                  border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                        <input type="radio" id="type_news" name="type" value="news"
                               class="sr-only"
                               {{ old('type', $article->type) === 'news' ? 'checked' : '' }}>
                        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center
                                    group-has-[:checked]:bg-blue-200 flex-shrink-0">
                            <span class="material-icons-round text-blue-600 text-[20px]">newspaper</span>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-800">ព័ត៌មាន</p>
                            <p class="text-xs text-slate-500">News</p>
                        </div>
                        <span class="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2
                                     border-slate-300 group-has-[:checked]:border-blue-500
                                     group-has-[:checked]:bg-blue-500 transition-all flex items-center justify-center">
                            <span class="material-icons-round text-white text-[10px] opacity-0
                                         group-has-[:checked]:opacity-100">check</span>
                        </span>
                    </label>

                    <label for="type_announcement"
                           class="relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                                  transition-all duration-150 group
                                  has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50
                                  border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                        <input type="radio" id="type_announcement" name="type" value="announcement"
                               class="sr-only"
                               {{ old('type', $article->type) === 'announcement' ? 'checked' : '' }}>
                        <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center
                                    group-has-[:checked]:bg-amber-200 flex-shrink-0">
                            <span class="material-icons-round text-amber-600 text-[20px]">campaign</span>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-800">ជូនដំណឹង</p>
                            <p class="text-xs text-slate-500">Announcement</p>
                        </div>
                        <span class="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2
                                     border-slate-300 group-has-[:checked]:border-amber-500
                                     group-has-[:checked]:bg-amber-500 transition-all flex items-center justify-center">
                            <span class="material-icons-round text-white text-[10px] opacity-0
                                         group-has-[:checked]:opacity-100">check</span>
                        </span>
                    </label>
                </div>
            </div>

            <div class="border-t border-slate-100"></div>

            {{-- ── Title ── --}}
            <div>
                <label for="title" class="block text-sm font-semibold text-slate-700 mb-1.5">
                    ចំណងជើង <span class="text-red-500">*</span>
                </label>
                <input type="text"
                       id="title"
                       name="title"
                       value="{{ old('title', $article->title) }}"
                       placeholder="ចំណងជើងអត្ថបទ..."
                       class="w-full bg-slate-50 border text-slate-800 placeholder-slate-400 rounded-xl
                              px-4 py-2.5 text-sm transition-all duration-150
                              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent
                              {{ $errors->has('title') ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300' }}">
                @error('title')
                    <p class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span class="material-icons-round text-[14px]">error_outline</span> {{ $message }}
                    </p>
                @enderror
            </div>

            {{-- ── Content ── --}}
            <div>
                <label for="content" class="block text-sm font-semibold text-slate-700 mb-1.5">
                    មាតិកា <span class="text-red-500">*</span>
                </label>
                <textarea id="content"
                          name="content"
                          rows="8"
                          placeholder="មាតិកាអត្ថបទ..."
                          class="w-full bg-slate-50 border text-slate-800 placeholder-slate-400 rounded-xl
                                 px-4 py-2.5 text-sm resize-y transition-all duration-150
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent
                                 {{ $errors->has('content') ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300' }}">{{ old('content', $article->content) }}</textarea>
                @error('content')
                    <p class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span class="material-icons-round text-[14px]">error_outline</span> {{ $message }}
                    </p>
                @enderror
            </div>

            <div class="border-t border-slate-100"></div>

            {{-- ── Cover Image ── --}}
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                    រូបភាពគម្រប (Cover Image)
                </label>

                {{-- Current image --}}
                @if($article->image_path)
                    <div class="mb-3 flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <img src="{{ asset('storage/' . $article->image_path) }}"
                             alt="current"
                             class="h-16 w-24 object-cover rounded-lg border border-slate-200">
                        <div>
                            <p class="text-xs font-semibold text-slate-700">រូបភាពបច្ចុប្បន្ន</p>
                            <p class="text-xs text-slate-400 mt-0.5">ជ្រើសរូបភាពថ្មីដើម្បីជំនួស</p>
                        </div>
                    </div>
                @endif

                <div class="relative border-2 border-dashed border-slate-200 hover:border-indigo-400
                            rounded-xl p-6 text-center cursor-pointer transition-all duration-150
                            hover:bg-indigo-50/30 group"
                     id="drop-zone">
                    <span class="material-icons-round text-4xl text-slate-300 group-hover:text-indigo-400
                                 transition-colors mb-2">cloud_upload</span>
                    <p class="text-sm font-medium text-slate-600">
                        ចុចដើម្បីជ្រើសរូបភាពថ្មី
                        <span class="text-indigo-600">ឬអូស&ទម្លាក់</span>
                    </p>
                    <p class="text-xs text-slate-400 mt-1">JPG, PNG, WebP · អតិបរមា 2MB</p>
                    <input type="file"
                           id="image"
                           name="image"
                           accept="image/jpg,image/jpeg,image/png,image/webp"
                           class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                </div>

                <div id="image-preview" class="hidden mt-3">
                    <img id="preview-img" src="" alt="preview"
                         class="h-40 rounded-xl object-cover border border-slate-200 shadow-sm">
                    <p id="preview-name" class="text-xs text-slate-500 mt-1"></p>
                </div>

                @error('image')
                    <p class="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span class="material-icons-round text-[14px]">error_outline</span> {{ $message }}
                    </p>
                @enderror
            </div>

            <div class="border-t border-slate-100"></div>

            {{-- ── Published Toggle ── --}}
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-semibold text-slate-700">ផ្សព្វផ្សាយ</p>
                    <p class="text-xs text-slate-400 mt-0.5">បើអនុញ្ញាត អត្ថបទនឹងមើលឃើញនៅគេហទំព័រ</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="is_published" value="1"
                           class="sr-only peer"
                           {{ old('is_published', $article->is_published ? '1' : '') ? 'checked' : '' }}>
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2
                                peer-focus:ring-indigo-500 rounded-full peer
                                peer-checked:after:translate-x-full peer-checked:bg-indigo-600
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:rounded-full after:h-5 after:w-5
                                after:transition-all border border-slate-300">
                    </div>
                </label>
            </div>

            {{-- ── Actions ── --}}
            <div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <a href="{{ route('admin.articles.index') }}"
                   class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                          bg-white hover:bg-slate-50 border border-slate-300
                          text-slate-700 font-medium text-sm
                          px-5 py-2.5 rounded-xl transition-all duration-150">
                    <span class="material-icons-round text-[18px]">arrow_back</span>
                    បោះបង់
                </a>
                <button type="submit"
                        id="btn-submit-article"
                        class="w-full sm:w-auto inline-flex items-center justify-center gap-2
                               bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                               text-white font-semibold text-sm
                               px-6 py-2.5 rounded-xl transition-all duration-150
                               shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-icons-round text-[18px]">save</span>
                    រក្សាទុកការផ្លាស់ប្ដូរ
                </button>
            </div>

        </form>
    </div>
</div>

@endsection

@push('scripts')
<script>
    document.getElementById('image').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('preview-img').src = ev.target.result;
            document.getElementById('preview-name').textContent = file.name;
            document.getElementById('image-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('form-edit-article').addEventListener('submit', function () {
        const btn = document.getElementById('btn-submit-article');
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            កំពុងរក្សាទុក…
        `;
    });
</script>
@endpush
