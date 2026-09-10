<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Teacher Login — Student Management System</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-900 flex items-center justify-center">

    <div class="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-white">Teacher Portal</h1>
            <p class="text-gray-400 mt-1">Student Management System</p>
        </div>

        @if ($errors->any())
            <div class="bg-red-600/20 border border-red-500 rounded-lg p-4 mb-6">
                @foreach ($errors->all() as $error)
                    <p class="text-red-400 text-sm">{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('teacher.login.submit') }}">
            @csrf

            <div class="mb-5">
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value="{{ old('email') }}"
                    required autofocus
                    class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="teacher@school.edu"
                >
            </div>

            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••••"
                >
            </div>

            <button
                type="submit"
                id="teacher-login-btn"
                class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
                Sign In as Teacher
            </button>
        </form>

        <p class="text-center text-gray-500 text-sm mt-6">
            <a href="/admin/login" class="text-emerald-400 hover:underline">Admin login →</a>
        </p>
    </div>

</body>
</html>
