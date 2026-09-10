<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\TeacherProfile;
use App\Models\Classroom;

class PublicController extends Controller
{
    /**
     * Retrieve global statistics for the public frontend
     */
    public function getStats()
    {
        try {
            $studentsCount   = Student::count();
            $teachersCount   = TeacherProfile::count(); // TeacherProfile is the authoritative teacher record
            $classroomsCount = Classroom::count();

            return response()->json([
                'success' => true,
                'data' => [
                    'students'          => $studentsCount,
                    'teachers'          => $teachersCount,
                    'classrooms'        => $classroomsCount,
                    'established_years' => '15+', // Static value as per requirement
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch statistics.',
            ], 500);
        }
    }

    /**
     * Retrieve published articles for the public frontend.
     * GET /api/public/articles?type=news|announcement&per_page=12
     */
    public function getArticles(Request $request)
    {
        $query = Article::published()->latest();

        // Optional filter by type: news | announcement
        if ($request->filled('type') && in_array($request->type, ['news', 'announcement'])) {
            $query->where('type', $request->type);
        }

        $perPage  = min((int) $request->get('per_page', 12), 50);
        $articles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $articles->map(function (Article $article) {
                return [
                    'id'           => $article->id,
                    'title'        => $article->title,
                    'slug'         => $article->slug,
                    'excerpt'      => \Str::limit(strip_tags($article->content), 120),
                    'content'      => $article->content,
                    'type'         => $article->type,
                    'image_url'    => $article->image_path
                                        ? asset('storage/' . $article->image_path)
                                        : null,
                    'published_at' => $article->created_at->translatedFormat('d F Y'),
                    'created_at'   => $article->created_at->toISOString(),
                ];
            }),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page'    => $articles->lastPage(),
                'total'        => $articles->total(),
            ],
        ]);
    }

    /**
     * Retrieve a single article by slug.
     * GET /api/public/articles/{slug}
     */
    public function showArticle($slug)
    {
        $article = Article::where('slug', $slug)
            ->orWhere('id', $slug)
            ->published()
            ->first();

        if (!$article) {
            return response()->json(['message' => 'រកមិនឃើញទិន្នន័យ'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id'           => $article->id,
                'title'        => $article->title,
                'slug'         => $article->slug,
                'content'      => $article->content,
                'type'         => $article->type,
                'image_url'    => $article->image_path
                                    ? asset('storage/' . $article->image_path)
                                    : null,
                'published_at' => $article->created_at->translatedFormat('d F Y'),
                'created_at'   => $article->created_at->toISOString(),
            ],
        ]);
    }
}

