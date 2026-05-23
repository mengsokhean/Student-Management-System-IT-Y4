import { useEffect, useState } from 'react'
import api from '../../lib/axios'

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/profile')
      .then(r => setProfile(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-sm">កំពុងផ្ទុក...</span>
        </div>
      </div>
    )
  }

  const activeClassroom = profile?.classrooms?.[0]

  return (
    <div className="space-y-5">

      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-green-700 to-teal-600 rounded-xl p-5
                      flex items-center gap-5 text-white shadow-sm">
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl
                        flex items-center justify-center flex-shrink-0">
          <span className="material-icons text-white text-4xl">school</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-green-100 text-sm">ប្រវត្តិរូបសិស្ស</p>
          <p className="text-xl font-bold truncate">{profile?.name_kh}</p>
          <p className="text-green-200 text-sm truncate">{profile?.name_en}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-mono font-bold text-lg">{profile?.student_code}</p>
          <span className={`badge mt-1 ${profile?.gender === 'female'
            ? 'bg-pink-200 text-pink-800' : 'bg-blue-200 text-blue-800'}`}>
            {profile?.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'meeting_room', bg: 'bg-blue-100',   ic: 'text-blue-600',
            label: 'ថ្នាក់រៀន', value: activeClassroom?.name ?? '—' },
          { icon: 'school',       bg: 'bg-green-100',  ic: 'text-green-600',
            label: 'ថ្នាក់ទី',  value: activeClassroom?.grade?.name ?? '—' },
          { icon: 'event_note',   bg: 'bg-purple-100', ic: 'text-purple-600',
            label: 'ឆ្នាំសិក្សា', value: activeClassroom?.academic_year?.name ?? '—' },
          { icon: 'public',       bg: 'bg-orange-100', ic: 'text-orange-600',
            label: 'ជំនាញ',
            value: activeClassroom?.track === 'science'
              ? 'វិទ្យាសាស្ត្រ'
              : activeClassroom?.track === 'social_science'
              ? 'សង្គមសាស្ត្រ'
              : '—'
          },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className={`material-icons ${c.ic} text-xl`}>{c.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className="font-bold text-gray-800 text-sm truncate">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Guardian Info */}
      {profile && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-green-600 text-xl">family_restroom</span>
              <h3 className="font-bold text-gray-800 text-sm">ព័ត៌មានអាណាព្យាបាល</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-gray-500 text-lg">person_outline</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">ឈ្មោះអាណាព្យាបាល</p>
                  <p className="text-sm font-semibold text-gray-800">{profile.guardian_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-gray-500 text-lg">phone</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">លេខទូរស័ព្ទ</p>
                  <p className="text-sm font-semibold text-gray-800">{profile.guardian_phone}</p>
                </div>
              </div>
              {profile.address && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons text-gray-500 text-lg">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">អាសយដ្ឋាន</p>
                    <p className="text-sm font-semibold text-gray-800">{profile.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <a href="/student/attendance"
          className="card p-5 flex items-center gap-4 hover:shadow-md
                     transition-shadow cursor-pointer group">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center
                          justify-center group-hover:bg-green-200 transition-colors">
            <span className="material-icons text-green-600 text-2xl">fact_check</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">វត្តមានខ្ញុំ</p>
            <p className="text-xs text-gray-500">ប្រចាំខែ</p>
          </div>
        </a>
        <a href="/student/report-card"
          className="card p-5 flex items-center gap-4 hover:shadow-md
                     transition-shadow cursor-pointer group">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center
                          justify-center group-hover:bg-blue-200 transition-colors">
            <span className="material-icons text-blue-600 text-2xl">summarize</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">សន្លឹកពិន្ទុ</p>
            <p className="text-xs text-gray-500">ប្រចាំឆ្នាំ</p>
          </div>
        </a>
      </div>

    </div>
  )
}