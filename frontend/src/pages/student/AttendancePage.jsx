import { useEffect, useState } from 'react'
import api from '../../lib/axios'

const STATUS_CONFIG = {
  present: { label: 'វត្តមាន',   icon: 'check_circle',    cls: 'badge-green',  row: ''            },
  absent:  { label: 'អវត្តមាន',  icon: 'cancel',          cls: 'badge-red',    row: 'bg-red-50'   },
  leave:   { label: 'ច្បាប់',    icon: 'event_available', cls: 'badge-blue',   row: 'bg-blue-50'  },
  late:    { label: 'យឺត',       icon: 'schedule',        cls: 'badge-yellow', row: 'bg-yellow-50'},
}

const MONTHS_KH = [
  '','មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា',
  'កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ',
]

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

export default function StudentAttendancePage() {
  const now = new Date()
  const [month,   setMonth]   = useState(now.getMonth() + 1)
  const [year,    setYear]    = useState(now.getFullYear())
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const res = await api.get('/student/attendance', { params: { month, year } })
      setData(res.data)
    } catch (_) {}
    setLoading(false)
  }

  useEffect(() => { fetchAttendance() }, [month, year])

  const totalDays = data?.records?.length ?? 0
  const pct = (key) => totalDays
    ? Math.round(((data?.summary?.[key] ?? 0) / totalDays) * 100) : 0

  return (
    <div className="space-y-5">

      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">វត្តមានរបស់ខ្ញុំ</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          តាមដានវត្តមានប្រចាំខែ
        </p>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="input-label">ខែ</label>
              <select className="input-field w-40"
                value={month}
                onChange={e => setMonth(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>ខែ {MONTHS_KH[m]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">ឆ្នាំ</label>
              <input type="number" className="input-field w-32"
                value={year}
                min={2020} max={2030}
                onChange={e => setYear(Number(e.target.value))} />
            </div>
            <button onClick={fetchAttendance}
              disabled={loading}
              className="btn-primary">
              {loading
                ? <><Spinner /><span>ផ្ទុក...</span></>
                : <><span className="material-icons text-lg">search</span>
                   <span>ស្វែងរក</span></>
              }
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Spinner />
          <span className="text-sm">កំពុងផ្ទុក...</span>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: 'present', label: 'ថ្ងៃវត្តមាន',   icon: 'check_circle',
                bg: 'bg-green-500', light: 'bg-green-50 border-green-200' },
              { key: 'absent',  label: 'ថ្ងៃអវត្តមាន',  icon: 'cancel',
                bg: 'bg-red-500',   light: 'bg-red-50 border-red-200'     },
              { key: 'leave',   label: 'ថ្ងៃច្បាប់',    icon: 'event_available',
                bg: 'bg-blue-500',  light: 'bg-blue-50 border-blue-200'   },
              { key: 'late',    label: 'ថ្ងៃយឺត',       icon: 'schedule',
                bg: 'bg-yellow-500', light: 'bg-yellow-50 border-yellow-200' },
            ].map(s => (
              <div key={s.key}
                className={`card border ${s.light.split(' ')[1]} p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center
                                  justify-center flex-shrink-0 shadow-sm`}>
                    <span className="material-icons text-white text-xl">{s.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {data.summary?.[s.key] ?? 0}
                    </p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${pct(s.key)}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{pct(s.key)}%</p>
              </div>
            ))}
          </div>

          {/* Classroom Info */}
          {data.classroom && (
            <div className="card border-l-4 border-blue-500">
              <div className="card-body py-3">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-blue-600 text-xl">meeting_room</span>
                  <div>
                    <p className="text-xs text-gray-500">ថ្នាក់រៀន</p>
                    <p className="font-bold text-gray-800">
                      {data.classroom.name} — {data.classroom.grade?.name}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">ខែ{MONTHS_KH[month]} {year}</p>
                    <p className="font-semibold text-gray-700">
                      សរុប {totalDays} ថ្ងៃ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Records Table */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <span className="material-icons text-blue-600 text-xl">calendar_month</span>
                <h3 className="font-bold text-gray-800 text-sm">
                  ប្រវត្តិវត្តមាន — ខែ{MONTHS_KH[month]} {year}
                </h3>
              </div>
              <span className="badge badge-blue">{totalDays} ថ្ងៃ</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-th w-8">#</th>
                    <th className="table-th">កាលបរិច្ឆេទ</th>
                    <th className="table-th">ថ្ងៃ</th>
                    <th className="table-th">ស្ថានភាព</th>
                    <th className="table-th">កំណត់ចំណាំ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="table-td text-center py-10">
                        <span className="material-icons text-4xl text-gray-200 block mb-2">
                          event_busy
                        </span>
                        <p className="text-sm text-gray-400">
                          គ្មានទិន្នន័យវត្តមានសម្រាប់ខែនេះ
                        </p>
                      </td>
                    </tr>
                  )}
                  {data.records?.map((r, i) => {
                    const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.present
                    const d   = new Date(r.date)
                    const day = d.toLocaleDateString('km-KH', { weekday: 'long' })
                    return (
                      <tr key={r.id} className={`${cfg.row} border-b border-gray-50`}>
                        <td className="table-td text-gray-400 text-xs">{i + 1}</td>
                        <td className="table-td font-mono font-medium text-gray-800">
                          {r.date}
                        </td>
                        <td className="table-td text-gray-500 text-sm">{day}</td>
                        <td className="table-td">
                          <span className={`badge ${cfg.cls}`}>
                            <span className="material-icons text-xs">{cfg.icon}</span>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="table-td text-gray-400 text-sm">
                          {r.note || '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="material-icons text-7xl mb-4 text-gray-200">event_note</span>
          <p className="text-base font-semibold">ជ្រើសខែ និងឆ្នាំ</p>
          <p className="text-sm mt-1.5">ដើម្បីមើលប្រវត្តិវត្តមាន</p>
        </div>
      )}
    </div>
  )
}