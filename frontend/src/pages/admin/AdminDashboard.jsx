import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import Breadcrumb from '../../components/common/Breadcrumb'

function StatCard({ icon, iconBg, label, value, sub, trend }) {
  return (
    <div className="card p-4 flex items-start gap-4">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center
                      justify-center flex-shrink-0 shadow-sm`}>
        <span className="material-icons text-white text-2xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-800 leading-tight">{value ?? '—'}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0
          ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  )
}

function AttendanceRing({ present, total }) {
  if (!total) return null
  const pct = Math.round((present / total) * 100)
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none"
          stroke="#e5e7eb" strokeWidth="8" />
        <circle cx="36" cy="36" r={r} fill="none"
          stroke={pct >= 80 ? '#16a34a' : pct >= 60 ? '#ca8a04' : '#dc2626'}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round" />
      </svg>
      <div>
        <p className="text-2xl font-bold text-gray-800">{pct}%</p>
        <p className="text-xs text-gray-500">វត្តមានថ្ងៃនេះ</p>
      </div>
    </div>
  )
}

const TRACK_CONFIG = {
  '10_general':       { label: 'ទី១០ — ទូទៅ',             color: 'bg-gray-500',   light: 'bg-gray-50   border-gray-200'  },
  '11_science':       { label: 'ទី១១ — វិទ្យាសាស្ត្រពិត',  color: 'bg-blue-600',   light: 'bg-blue-50   border-blue-200'  },
  '11_social_science':{ label: 'ទី១១ — វិទ្យាសាស្ត្រសង្គម', color: 'bg-purple-600', light: 'bg-purple-50 border-purple-200'},
  '12_science':       { label: 'ទី១២ — វិទ្យាសាស្ត្រពិត',  color: 'bg-green-600',  light: 'bg-green-50  border-green-200' },
  '12_social_science':{ label: 'ទី១២ — វិទ្យាសាស្ត្រសង្គម', color: 'bg-orange-500', light: 'bg-orange-50 border-orange-200'},
}

export default function AdminDashboard() {
  const [classrooms, setClassrooms] = useState([])
  const [teachers,   setTeachers]   = useState([])
  const [years,      setYears]      = useState([])
  const [subjects,   setSubjects]   = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [cr, tr, yr, su] = await Promise.all([
          api.get('/admin/classrooms'),
          api.get('/admin/teachers'),
          api.get('/admin/academic-years'),
          api.get('/admin/subjects'),
        ])
        setClassrooms(cr.data)
        setTeachers(tr.data)
        setYears(yr.data)
        setSubjects(su.data)
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [])

  const activeYear = years.find(y => y.is_active)

  // Count students across all classrooms (approx from enrollment)
  const totalClasses = classrooms.length

  // Track distribution
  const trackDist = {
    '10_general':        classrooms.filter(c => c.grade?.level === '10').length,
    '11_science':        classrooms.filter(c => c.grade?.level === '11' && c.track === 'science').length,
    '11_social_science': classrooms.filter(c => c.grade?.level === '11' && c.track === 'social_science').length,
    '12_science':        classrooms.filter(c => c.grade?.level === '12' && c.track === 'science').length,
    '12_social_science': classrooms.filter(c => c.grade?.level === '12' && c.track === 'social_science').length,
  }
  const maxTrack = Math.max(...Object.values(trackDist), 1)

  // Recent activities (static demo data — replace with API)
  const activities = [
    { icon: 'person_add',       color: 'bg-green-100 text-green-600',  text: 'ចុះឈ្មោះសិស្ស ហេង ស្រីនិច ចូលថ្នាក់ ១២A',    time: '១០ នាទីមុន'  },
    { icon: 'assignment_ind',   color: 'bg-blue-100 text-blue-600',    text: 'ចាត់តាំងគ្រូ ចន្ទ សុភាព ជា Homeroom ថ្នាក់ ១១B', time: '២០ នាទីមុន'  },
    { icon: 'fact_check',       color: 'bg-purple-100 text-purple-600', text: 'ចុះវត្តមានថ្នាក់ ១០C — ៤២/៤៥ នាក់វត្តមាន',     time: '៤៥ នាទីមុន'  },
    { icon: 'grade',            color: 'bg-orange-100 text-orange-600', text: 'បញ្ចូលពិន្ទុ គណិតវិទ្យា ថ្នាក់ ១២A វគ្គ ១',    time: '១ ម៉ោងមុន'   },
    { icon: 'how_to_reg',       color: 'bg-teal-100 text-teal-600',    text: 'ចុះឈ្មោះសិស្ស ៥ នាក់ ចូលថ្នាក់ ១១A វិទ្យាសាស្ត្រ', time: '២ ម៉ោងមុន' },
  ]

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
    <div className="space-y-5">

      <Breadcrumb items={[
        { label: 'ទំព័រដើម', path: '/admin/dashboard', icon: 'home' },
      ]} />

      {/* ── Active Year Hero Banner ── */}
      {activeYear && (
        <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-blue-800
                        rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-400 rounded-full"/>
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-indigo-400 rounded-full"/>
          </div>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white bg-opacity-15 rounded-2xl flex items-center
                              justify-center border border-white border-opacity-20">
                <span className="material-icons text-white text-3xl">school</span>
              </div>
              <div>
                <p className="text-blue-200 text-xs font-medium uppercase tracking-widest">
                  ឆ្នាំសិក្សាសកម្ម
                </p>
                <p className="text-white font-bold text-xl mt-0.5">{activeYear.name}</p>
                <p className="text-blue-200 text-sm mt-0.5">
                  {activeYear.start_date} → {activeYear.end_date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: 'ថ្នាក់',     val: totalClasses,      icon: 'meeting_room'       },
                { label: 'គ្រូ',       val: teachers.length,   icon: 'supervisor_account' },
                { label: 'មុខវិជ្ជា', val: subjects.length,   icon: 'menu_book'          },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-white font-bold text-2xl">{s.val}</p>
                  <p className="text-blue-200 text-xs">{s.label}</p>
                </div>
              ))}
              <span className="badge bg-green-400 bg-opacity-20 text-green-300
                               border border-green-400 border-opacity-30 text-sm">
                <span className="material-icons text-sm">check_circle</span>
                សកម្ម
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Stat Cards Row 1 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { icon: 'groups',           iconBg: 'bg-blue-600',   label: 'សិស្សសរុប',    value: '—',              sub: 'ចុះឈ្មោះ'          },
          { icon: 'supervisor_account', iconBg: 'bg-purple-600', label: 'គ្រូបង្រៀន',    value: teachers.length,  sub: 'នៅក្នុងប្រព័ន្ធ'   },
          { icon: 'meeting_room',     iconBg: 'bg-indigo-600', label: 'ថ្នាក់រៀន',     value: totalClasses,     sub: `ឆ្នាំ ${activeYear?.name || '—'}` },
          { icon: 'menu_book',        iconBg: 'bg-teal-600',   label: 'មុខវិជ្ជា',     value: subjects.length,  sub: 'ក្នុងប្រព័ន្ធ'     },
          { icon: 'check_circle',     iconBg: 'bg-green-600',  label: 'វត្តមានថ្ងៃនេះ', value: '—',              sub: 'នាក់'               },
          { icon: 'cancel',           iconBg: 'bg-red-500',    label: 'អវត្តមានថ្ងៃនេះ', value: '—',             sub: 'នាក់'               },
        ].map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Track Distribution — 2/3 */}
        <div className="xl:col-span-2 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">account_tree</span>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">
                  ការបែងចែកតាម Track / កម្មវិធីសិក្សា
                </h3>
                <p className="text-xs text-gray-400">ចំនួនថ្នាក់រៀននីមួយៗ</p>
              </div>
            </div>
          </div>
          <div className="card-body space-y-3">
            {Object.entries(TRACK_CONFIG).map(([key, cfg]) => {
              const count = trackDist[key] || 0
              const pct   = maxTrack ? Math.round((count / maxTrack) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cfg.color} flex-shrink-0`}/>
                      <span className="text-sm font-medium text-gray-700">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-800">
                        {count} ថ្នាក់
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cfg.color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}

            {/* Track Badges Summary */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              <span className="badge badge-gray text-xs">
                <span className="material-icons text-xs">school</span>
                ទូទៅ: {trackDist['10_general']}
              </span>
              <span className="badge badge-blue text-xs">
                <span className="material-icons text-xs">science</span>
                វិទ្យាសាស្ត្រពិត: {trackDist['11_science'] + trackDist['12_science']}
              </span>
              <span className="badge badge-purple text-xs">
                <span className="material-icons text-xs">public</span>
                វិទ្យាសាស្ត្រសង្គម: {trackDist['11_social_science'] + trackDist['12_social_science']}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Ring + Quick Info — 1/3 */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons text-green-600 text-xl">bar_chart</span>
              <h3 className="font-bold text-gray-800 text-sm">វត្តមានថ្ងៃនេះ</h3>
            </div>
            <AttendanceRing present={0} total={0} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { label: 'វត្តមាន',   val: '—', cls: 'bg-green-50  text-green-700'  },
                { label: 'អវត្តមាន',  val: '—', cls: 'bg-red-50    text-red-600'    },
                { label: 'ច្បាប់',    val: '—', cls: 'bg-blue-50   text-blue-700'   },
                { label: 'យឺត',       val: '—', cls: 'bg-yellow-50 text-yellow-700' },
              ].map(s => (
                <div key={s.label}
                  className={`rounded-lg p-2.5 text-center ${s.cls}`}>
                  <p className="font-bold text-base">{s.val}</p>
                  <p className="text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Semester Info */}
          {activeYear && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-icons text-blue-600 text-xl">event_note</span>
                <h3 className="font-bold text-gray-800 text-sm">ព័ត៌មានសិក្សា</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: 'school',          label: 'ឆ្នាំសិក្សា',  val: activeYear.name                    },
                  { icon: 'calendar_today',  label: 'ចាប់ផ្តើម',    val: activeYear.start_date              },
                  { icon: 'event',           label: 'បញ្ចប់',       val: activeYear.end_date                },
                  { icon: 'meeting_room',    label: 'ថ្នាក់',        val: `${totalClasses} ថ្នាក់`          },
                  { icon: 'supervisor_account', label: 'គ្រូ',      val: `${teachers.length} នាក់`         },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center
                                    justify-center flex-shrink-0">
                      <span className="material-icons text-blue-600 text-sm">{item.icon}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-xs font-bold text-gray-800">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-orange-500 text-xl">notifications_active</span>
              <h3 className="font-bold text-gray-800 text-sm">សកម្មភាពថ្មីៗ</h3>
            </div>
            <span className="badge badge-yellow">{activities.length} ថ្មី</span>
          </div>
          <div className="divide-y divide-gray-50">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5
                                      hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                flex-shrink-0 mt-0.5 ${a.color}`}>
                  <span className="material-icons text-base">{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <span className="material-icons text-xs">schedule</span>
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <button className="text-sm text-blue-600 hover:text-blue-800
                               font-medium flex items-center gap-1">
              <span>មើលសកម្មភាពទាំងអស់</span>
              <span className="material-icons text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Classrooms Quick Overview */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">meeting_room</span>
              <h3 className="font-bold text-gray-800 text-sm">ថ្នាក់រៀន (ថ្មីៗ)</h3>
            </div>
            <span className="badge badge-blue">{totalClasses} ថ្នាក់</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">ថ្នាក់</th>
                  <th className="table-th">ថ្នាក់ទី</th>
                  <th className="table-th">Track</th>
                  <th className="table-th text-center">អតិបរមា</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.length === 0 && (
                  <tr>
                    <td colSpan={4} className="table-td text-center py-8 text-gray-400 text-sm">
                      គ្មានថ្នាក់រៀន
                    </td>
                  </tr>
                )}
                {classrooms.slice(0, 6).map(c => (
                  <tr key={c.id} className="table-tr-hover">
                    <td className="table-td">
                      <span className="font-bold text-gray-800">{c.name}</span>
                    </td>
                    <td className="table-td">
                      <span className="badge badge-blue text-xs">{c.grade?.name}</span>
                    </td>
                    <td className="table-td">
                      {c.track === 'science'
                        ? <span className="badge badge-green text-xs">
                            <span className="material-icons text-xs">science</span>
                            វិទ្យាសាស្ត្រពិត
                          </span>
                        : c.track === 'social_science'
                        ? <span className="badge badge-purple text-xs">
                            <span className="material-icons text-xs">public</span>
                            វិទ្យាសាស្ត្រសង្គម
                          </span>
                        : <span className="badge badge-gray text-xs">ទូទៅ</span>
                      }
                    </td>
                    <td className="table-td text-center text-sm font-mono text-gray-600">
                      {c.max_students}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {classrooms.length > 6 && (
            <div className="px-5 py-3 border-t border-gray-100">
              <a href="/admin/classrooms"
                className="text-sm text-blue-600 hover:text-blue-800
                           font-medium flex items-center gap-1">
                <span>មើលថ្នាក់ទាំងអស់ ({totalClasses})</span>
                <span className="material-icons text-base">arrow_forward</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}