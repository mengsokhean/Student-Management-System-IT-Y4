<!DOCTYPE html>
<html lang="km" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - មិនមានទំព័រនេះទេ</title>

    {{-- Google Fonts --}}
    <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
    
    {{-- Tailwind CSS CDN --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Kantumruy Pro', 'Inter', sans-serif; }
    </style>
</head>
<body class="h-full bg-slate-50 flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center">
        <div class="mb-8">
            <h1 class="text-[120px] font-black text-slate-200 leading-none tracking-tighter">404</h1>
        </div>
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div class="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span class="material-icons-round text-red-500 text-3xl">search_off</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">រកមិនឃើញទំព័រទេ</h2>
            <p class="text-slate-500 mb-8 leading-relaxed">
                សុំទោស, យើងរកមិនឃើញទំព័រដែលអ្នកកំពុងស្វែងរកទេ។ ទំព័រនេះប្រហែលជាត្រូវបានលុប ឬផ្លាស់ប្តូរទីតាំង។
            </p>
            <a href="{{ url()->previous() !== url()->current() ? url()->previous() : '/admin/dashboard' }}" 
               class="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm shadow-indigo-200">
                <span class="material-icons-round text-[18px]">arrow_back</span>
                ត្រឡប់ទៅទំព័រដើម
            </a>
        </div>
        <div class="mt-8 text-sm text-slate-400">
            &copy; {{ date('Y') }} ប្រព័ន្ធគ្រប់គ្រងសាលារៀន
        </div>
    </div>
</body>
</html>
