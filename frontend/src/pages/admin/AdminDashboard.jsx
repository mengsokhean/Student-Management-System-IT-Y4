import { useEffect, useState } from 'react'
import api from '../../lib/axios'

const StatCard = ({ icon, iconBg, label, value, sub }) => (
  <div className="stat-card">
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <span className="material-icons text-white text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    years: [], classrooms: [], teachers: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [y, c, t] = await Promise.all([
          api.get('/admin/academic-years'),
          api.get('/admin/classrooms'),
          api.get('/admin/teachers'),
        ])
        setStats({ years: y.data, classrooms: c.data, teachers: t.data })
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [])

  const activeYear = stats.years.find(y => y.is_active)

  const classroomsByGrade = stats.classrooms.reduce((acc, c) => {
    const g = c.grade?.name || 'មិនស្គាល់'
    acc[g] = (acc[g] || 0) + 1
    return acc
  }, {})

  const scienceCount = stats.classrooms.filter(c => c.track === 'science').length
  const socialCount  = stats.classrooms.filter(c => c.track === 'social_science').length

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

  return (
    <div className="space-y-6">

      {/* ── Active Year Banner ── */}
      {activeYear && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-5
                        flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl
                            flex items-center justify-center">
              <span className="material-icons text-white text-2xl">event_available</span>
            </div>
            <div>
              <p className="text-blue-100 text-sm">ឆ្នាំសិក្សាសកម្ម</p>
              <p className="text-xl font-bold">{activeYear.name}</p>
              <p className="text-blue-200 text-xs mt-0.5">
                {activeYear.start_date} → {activeYear.end_date}
              </p>
            </div>
          </div>
          <span className="badge bg-white bg-opacity-20 text-white border border-white border-opacity-30 text-sm px-3 py-1.5">
            <span className="material-icons text-sm">check_circle</span>
            សកម្ម
          </span>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="event_note"
          iconBg="bg-indigo-500"
          label="ឆ្នាំសិក្សា"
          value={stats.years.length}
          sub={`${stats.years.filter(y => y.is_active).length} សកម្ម`}
        />
        <StatCard
          icon="meeting_room"
          iconBg="bg-blue-500"
          label="ថ្នាក់រៀន"
          value={stats.classrooms.length}
          sub={activeYear ? `ឆ្នាំ ${activeYear.name}` : undefined}
        />
        <StatCard
          icon="supervisor_account"
          iconBg="bg-purple-500"
          label="គ្រូបង្រៀន"
          value={stats.teachers.length}
          sub="នៅក្នុងប្រព័ន្ធ"
        />
        <StatCard
          icon="groups"
          iconBg="bg-green-500"
          label="សិស្សសរុប"
          value="—"
          sub="ក្នុងឆ្នាំសិក្សានេះ"
        />
      </div>

      {/* ── Two Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Classrooms by Grade */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">bar_chart</span>
              <h3 className="font-bold text-gray-800 text-sm">ថ្នាក់រៀនតាមថ្នាក់ទី</h3>
            </div>
          </div>
          <div className="card-body space-y-3">
            {Object.entries(classroomsByGrade).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">គ្មានទិន្នន័យ</p>
            ) : (
              Object.entries(classroomsByGrade).map(([grade, count]) => {
                const pct = Math.round((count / stats.classrooms.length) * 100) || 0
                return (
                  <div key={grade}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{grade}</span>
                      <span className="text-gray-500">{count} ថ្នាក់</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}

            {stats.classrooms.length > 0 && (
              <div className="pt-3 border-t border-gray-100 flex gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
                  វិទ្យាសាស្ត្រ: <strong>{scienceCount}</strong>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-violet-400 inline-block" />
                  សង្គមសាស្ត្រ: <strong>{socialCount}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teacher List */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-purple-600 text-xl">supervisor_account</span>
              <h3 className="font-bold text-gray-800 text-sm">គ្រូបង្រៀនថ្មីៗ</h3>
            </div>
            <span className="badge badge-purple">{stats.teachers.length} នាក់</span>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.teachers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">គ្មានទិន្នន័យ</p>
            )}
            {stats.teachers.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3
                                         hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                  ${t.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                  <span className={`material-icons text-lg
                    ${t.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                    person
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{t.name_kh}</p>
                  <p className="text-xs text-gray-400 truncate">{t.teacher_code}</p>
                </div>
                <span className={`badge ${t.gender === 'female' ? 'badge-red' : 'badge-blue'} text-xs`}>
                  {t.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Classroom Table ── */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <span className="material-icons text-blue-600 text-xl">meeting_room</span>
            <h3 className="font-bold text-gray-800 text-sm">បញ្ជីថ្នាក់រៀន</h3>
          </div>
          <span className="badge badge-blue">{stats.classrooms.length} ថ្នាក់</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">#</th>
                <th className="table-th">ឈ្មោះថ្នាក់</th>
                <th className="table-th">ថ្នាក់ទី</th>
                <th className="table-th">ជំនាញ</th>
                <th className="table-th">ឆ្នាំសិក្សា</th>
                <th className="table-th">អតិបរមា</th>
              </tr>
            </thead>
            <tbody>
              {stats.classrooms.length === 0 && (
                <tr>
                  <td colSpan={6} className="table-td text-center text-gray-400 py-8">
                    <span className="material-icons text-3xl block mb-2 text-gray-300">
                      meeting_room
                    </span>
                    គ្មានថ្នាក់រៀន
                  </td>
                </tr>
              )}
              {stats.classrooms.map((c, i) => (
                <tr key={c.id} className="table-tr-hover">
                  <td className="table-td text-gray-400 text-xs w-10">{i + 1}</td>
                  <td className="table-td">
                    <span className="font-bold text-gray-800">{c.name}</span>
                  </td>
                  <td className="table-td">
                    <span className="badge badge-blue">{c.grade?.name}</span>
                  </td>
                  <td className="table-td">
                    {c.track === 'science'
                      ? <span className="badge badge-green">
                          <span className="material-icons text-xs">science</span>
                          វិទ្យាសាស្ត្រ
                        </span>
                      : c.track === 'social_science'
                      ? <span className="badge badge-purple">
                          <span className="material-icons text-xs">public</span>
                          សង្គមសាស្ត្រ
                        </span>
                      : <span className="text-gray-400 text-xs">—</span>
                    }
                  </td>
                  <td className="table-td text-gray-600">{c.academic_year?.name}</td>
                  <td className="table-td">
                    <span className="text-gray-600 font-mono text-xs">{c.max_students} នាក់</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}