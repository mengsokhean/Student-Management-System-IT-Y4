import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../../lib/axios'

// Mock data removed in favor of dynamic API data

export default function HomePage() {
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  const [recentNews, setRecentNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)

  useEffect(() => {
    // Fetch Stats
    api.get('/public/stats')
      .then(res => {
        if (res.data.success) {
          setStats(res.data.data)
        }
      })
      .catch(err => console.error("Failed to fetch stats", err))
      .finally(() => setLoadingStats(false))
      
    // Fetch Recent News (limit 3)
    api.get('/public/articles?type=news&per_page=3')
      .then(res => {
        if (res.data.success) {
          setRecentNews(res.data.data)
        }
      })
      .catch(err => console.error("Failed to fetch recent news", err))
      .finally(() => setLoadingNews(false))
  }, [])

  const displayStats = [
    { icon: 'groups',             key: 'students',          label: 'សិស្សសរុប'  },
    { icon: 'supervisor_account', key: 'teachers',          label: 'គ្រូបង្រៀន' },
    { icon: 'meeting_room',       key: 'classrooms',        label: 'ថ្នាក់រៀន'   },
    { icon: 'emoji_events',       key: 'established_years', label: 'ឆ្នាំបង្កើត' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50
                          relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full
                          translate-x-1/2 -translate-y-1/2"/>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 rounded-full
                          -translate-x-1/2 translate-y-1/2"/>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-blue-500 bg-opacity-20
                               text-blue-200 text-xs font-semibold px-3 py-1.5
                               rounded-full border border-blue-400 border-opacity-30">
                <span className="material-icons text-sm">verified</span>
                ក្រសួងអប់រំ យុវជន និងកីឡា
              </span>
            </div>
            <h1 className="mb-2">
              <span className="block text-slate-900 text-5xl md:text-6xl font-extrabold
                             leading-tight tracking-tight">
                វិទ្យាល័យ <span className="text-blue-700">NIEI</span>
              </span>
              <span className="block text-slate-500 text-base md:text-lg font-medium
                             leading-snug mt-2"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.01em' }}>
                National Institute of Entrepreneurship and Innovation
              </span>
            </h1>
            <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-lg">
              សូមស្វាគមន៍មកកាន់វិទ្យាល័យ NIEI — ខ្ញុំផ្ដល់ការអប់រំដ៏មានគុណភាពខ្ពស់
              ដល់យុវជនកម្ពុជា ជំរុញការច្នៃប្រឌិត និងសហគ្គកម្ម។
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link to="/results"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white
                           rounded-xl font-bold hover:bg-slate-800 transition-colors
                           shadow-lg">
                <span className="material-icons">search</span>
                ពិនិត្យលទ្ធផលសិក្សា
              </Link>
              <Link to="/about"
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-800
                           rounded-xl font-semibold hover:bg-slate-50 transition-colors
                           border border-slate-200 shadow-sm">
                <span className="material-icons">info</span>
                ស្វែងយល់អំពីសាលា
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loadingStats ? (
              /* Skeleton — 4 pulse cards */
              displayStats.map(s => (
                <div key={s.key} className="text-center animate-pulse">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {/* icon placeholder */}
                    <div className="w-7 h-7 rounded-full bg-blue-100" />
                    {/* number placeholder */}
                    <div className="h-8 w-16 bg-slate-200 rounded-lg" />
                  </div>
                  {/* label placeholder */}
                  <div className="h-3.5 w-20 bg-slate-200 rounded-full mx-auto" />
                </div>
              ))
            ) : (
              displayStats.map(s => (
                <div key={s.key} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-icons text-blue-600 text-2xl">{s.icon}</span>
                    <p className="text-3xl font-bold text-gray-800">
                      {stats ? stats[s.key] : '—'}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Result Search CTA */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-8
                        flex items-center justify-between flex-wrap gap-6 relative
                        overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <span className="material-icons text-white" style={{ fontSize: '160px' }}>
              search
            </span>
          </div>
          <div className="relative z-10">
            <h2 className="text-white text-2xl font-bold mb-0">
              ពិនិត្យលទ្ធផលសិក្សា
            </h2>
          </div>
          <Link to="/results"
            className="relative z-10 flex items-center gap-2 px-6 py-3 bg-amber-500
                       text-slate-900 rounded-xl font-bold hover:bg-amber-400
                       transition-colors shadow-md flex-shrink-0">
            <span className="material-icons">search</span>
            ស្វែងរកឥឡូវ
          </Link>
        </div>
      </section>

      {/* News Section */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ព័ត៌មានថ្មីៗ</h2>
          </div>
          <Link to="/news"
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
            <span>មើលទាំងអស់</span>
            <span className="material-icons text-base">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {loadingNews ? (
             /* Skeleton */
             [1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-xl border border-gray-200 p-4 h-[350px] animate-pulse">
                <div className="bg-slate-200 h-48 w-full rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
             ))
          ) : recentNews.length === 0 ? (
             /* Empty */
             <div className="col-span-1 md:col-span-3 text-center py-10">
               <span className="material-icons text-slate-300 text-5xl mb-2">article</span>
               <p className="text-slate-500 font-medium">មិនទាន់មានព័ត៌មាននៅឡើយទេ</p>
             </div>
          ) : (
            recentNews.map((n) => (
              <Link to={`/article/${n.slug}`} key={n.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden
                           shadow-sm hover:-translate-y-1 hover:shadow-lg
                           transition-all duration-300 cursor-pointer group flex flex-col">
                {/* Card Image */}
                <div className="relative overflow-hidden flex-shrink-0">
                  <img
                    src={n.image_url || 'https://placehold.co/600x400/dbeafe/1e40af?text=News'}
                    alt={n.title}
                    className="h-48 w-full object-cover group-hover:scale-105
                               transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm
                                     text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full
                                     shadow-sm">
                      <span className="material-icons text-sm">article</span>
                      ព័ត៌មាន
                    </span>
                  </div>
                </div>
                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">{n.published_at}</p>
                  <h3 className="font-bold text-gray-800 text-base leading-snug mb-2 line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                    {n.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-blue-600 mt-auto
                                  font-semibold text-sm group-hover:gap-2 transition-all">
                    អានបន្ត
                    <span className="material-icons text-sm">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}