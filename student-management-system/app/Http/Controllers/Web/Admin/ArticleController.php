<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    // GET /admin/articles
    public function index()
    {
        $articles = Article::latest()->paginate(20);
        return view('admin.articles.index', compact('articles'));
    }

    // GET /admin/articles/create
    public function create()
    {
        return view('admin.articles.create');
    }

    // POST /admin/articles
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'type'         => 'required|in:news,announcement',
            'is_published' => 'nullable|boolean',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $article = new Article();
        $article->title        = $data['title'];
        $article->slug         = Str::slug($data['title']) . '-' . Str::random(6);
        $article->content      = $data['content'];
        $article->type         = $data['type'];
        $article->is_published = $request->boolean('is_published', true);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $article->image_path = $path;
        }

        $article->save();

        \App\Models\ActivityLog::log('created', 'Article', "Created article: {$article->title}");

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'អត្ថបទត្រូវបានបន្ថែមដោយជោគជ័យ។');
    }

    // GET /admin/articles/{article}/edit
    public function edit(Article $article)
    {
        return view('admin.articles.edit', compact('article'));
    }

    // PUT /admin/articles/{article}
    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'type'         => 'required|in:news,announcement',
            'is_published' => 'nullable|boolean',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $article->title        = $data['title'];
        $article->content      = $data['content'];
        $article->type         = $data['type'];
        $article->is_published = $request->boolean('is_published', true);

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($article->image_path) {
                Storage::disk('public')->delete($article->image_path);
            }
            $path = $request->file('image')->store('articles', 'public');
            $article->image_path = $path;
        }

        $article->save();

        \App\Models\ActivityLog::log('updated', 'Article', "Updated article: {$article->title}");

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'អត្ថបទត្រូវបានកែប្រែដោយជោគជ័យ។');
    }

    // DELETE /admin/articles/{article}
    public function destroy(Article $article)
    {
        if ($article->image_path) {
            Storage::disk('public')->delete($article->image_path);
        }

        $title = $article->title;
        $article->delete();

        \App\Models\ActivityLog::log('deleted', 'Article', "Deleted article: {$title}");

        return redirect()
            ->route('admin.articles.index')
            ->with('success', 'អត្ថបទត្រូវបានលុបដោយជោគជ័យ។');
    }
}
