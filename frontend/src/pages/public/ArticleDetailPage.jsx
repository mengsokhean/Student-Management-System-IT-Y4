import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/axios'

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/public/articles/${slug}`)
        setArticle(res.data.data)
      } catch (err) {
        setError('រកមិនឃើញអត្ថបទ ឬមានបញ្ហាប្រព័ន្ធ')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 flex justify-center items-start">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 flex flex-col items-center justify-start pt-32">
        <span className="material-icons text-slate-400 text-6xl mb-4">article</span>
        <p className="text-slate-600 text-lg font-medium">{error || 'រកមិនឃើញអត្ថបទ'}</p>
        <button onClick={() => navigate(-1)} className="mt-6 text-indigo-600 font-semibold hover:underline">
          ត្រឡប់ក្រោយ
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        
        {/* Top: Go Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          ត្រឡប់ក្រោយ
        </button>

        {/* Image */}
        <img
          src={article.image_url || 'https://placehold.co/1200x600/e2e8f0/64748b?text=No+Image'}
          alt={article.title}
          className="w-full h-[400px] object-cover rounded-2xl shadow-sm mt-6 bg-slate-200"
        />

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-8 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-slate-500 mt-4 text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <span className="material-icons text-[16px]">event</span>
            {article.published_at}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-icons text-[16px]">
              {article.type === 'news' ? 'article' : 'campaign'}
            </span>
            {article.type === 'news' ? 'ព័ត៌មាន' : 'ជូនដំណឹង'}
          </span>
        </div>

        {/* Content */}
        <div className="prose max-w-none mt-10 text-slate-700 leading-relaxed text-lg"
             dangerouslySetInnerHTML={{ __html: article.content }}>
        </div>

      </div>
    </div>
  )
}
