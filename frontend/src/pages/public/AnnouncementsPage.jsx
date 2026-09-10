import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/axios'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/public/articles?type=announcement')
        setAnnouncements(res.data.data)
      } catch (error) {
        console.error('Failed to fetch announcements', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            សេចក្ដីជូនដំណឹង
          </h1>
          <p className="text-slate-500 text-lg">
            សេចក្ដីជូនដំណឹងជាផ្លូវការ និងសេចក្ដីប្រកាសផ្សេងៗពីគណៈគ្រប់គ្រងសាលា
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-4 h-[350px]">
                <div className="bg-slate-200 h-40 w-full rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <span className="material-icons-round text-slate-300 text-6xl mb-4">campaign</span>
            <p className="text-slate-500 text-lg font-medium">មិនទាន់មានទិន្នន័យនៅឡើយទេ</p>
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <Link to={`/article/${item.slug}`} key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
                           flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                           cursor-pointer group">

                {/* Cover Image */}
                <div className="relative overflow-hidden flex-shrink-0">
                  <img
                    src={item.image_url || 'https://placehold.co/600x400/fff7ed/92400e?text=Announcement'}
                    alt={item.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-amber-700
                                     text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      ជូនដំណឹង
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-sm font-semibold text-amber-600 mb-2">
                    {item.published_at}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 mb-3 leading-snug line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed flex-grow line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-amber-600 group-hover:text-amber-700
                                     transition-colors inline-flex items-center gap-1.5 text-sm">
                      អានបន្ត
                      <span className="material-icons text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
