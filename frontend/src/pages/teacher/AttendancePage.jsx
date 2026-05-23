import { useEffect, useState } from 'react'
import api from '../../lib/axios'

const STATUS_OPTIONS = [
  {
    value:   'present',
    label:   'វត្តមាន',
    icon:    'check_circle',
    active:  'bg-green-600 text-white border-green-600 shadow-sm',
    inactive:'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-600',
    row:     'bg-green-50',
  },
  {
    value:   'absent',
    label:   'អវត្តមាន',
    icon:    'cancel',
    active:  'bg-red-500 text-white border-red-500 shadow-sm',
    inactive:'bg-white text-gray-500 border-gray-200 hover:border-red-400 hover:text-red-500',
    row:     'bg-red-50',
  },
  {
    value:   'leave',
    label:   'ច្បាប់',
    icon:    'event_available',
    active:  'bg-blue-500 text-white border-blue-500 shadow-sm',
    inactive:'bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-500',
    row:     'bg-blue-50',
  },
  {
    value:   'late',
    label:   'យឺត',
    icon:    'schedule',
    active:  'bg-yellow-500 text-white border-yellow-500 shadow-sm',
    inactive:'bg-white text-gray-500 border-gray-200 hover:border-yellow-400 hover:text-yellow-600',
    row:     'bg-yellow-50',
  },
]

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

export default function AttendancePage() {
  const [myData,   setMyData]   = useState(null)
  const [selected, setSelected] = useState('')
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [records,  setRecords]  = useState({})
  const [notes,    setNotes]    = useState({})
  const [loading,  setLoading]  = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    api.get('/teacher/my-classrooms').then(res => {
      setMyData(res.data)
      if (res.data.homeroom?.id) {
        setSelected(res.data.homeroom.id.toString())
      }
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    loadAll()
  }, [selected, date])

  const loadAll = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const stuRes = await api.get(`/teacher/classrooms/${selected}/students`)
      setStudents(stuRes.data)

      const defaultRec = {}
      const defaultNote = {}
      stuRes.data.forEach(s => {
        defaultRec[s.id]  = 'present'
        defaultNote[s.id] = ''
      })

      try {
        const attRes = await api.get('/teacher/attendance', {
          params: { classroom_id: selected, date },
        })
        if (attRes.data.length > 0) {
          attRes.data.forEach(a => {
            defaultRec[a.student_id]  = a.status
            defaultNote[a.student_id] = a.note || ''
          })
        }
      } catch (_) {}

      setRecords(defaultRec)
      setNotes(defaultNote)
    } catch (_) {}
    setLoading(false)
  }

  const setStatus = (sid, status) =>
    setRecords(prev => ({ ...prev, [sid]: status }))

  const setNote = (sid, note) =>
    setNotes(prev => ({ ...prev, [sid]: note }))

  const markAll = (status) => {
    const r = {}
    students.forEach(s => { r[s.id] = status })
    setRecords(r)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await api.post('/teacher/attendance/bulk', {
        classroom_id: selected,
        date,
        records: students.map(s => ({
          student_id: s.id,
          status:     records[s.id] || 'present',
          note:       notes[s.id]   || '',
        })),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (_) {}
    setSaving(false)
  }

  const summary = {
    present: Object.values(records).filter(v => v === 'present').length,
    absent:  Object.values(records).filter(v => v === 'absent').length,
    leave:   Object.values(records).filter(v => v === 'leave').length,
    late:    Object.values(records).filter(v => v === 'late').length,
  }

  const homeroom = myData?.homeroom
  const filtered = students.filter(s =>
    s.name_kh.includes(search) ||
    s.student_code.toLowerCase().includes(search.toLowerCase())
  )

  const todayKH = new Date(date).toLocaleDateString('km-KH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-5">

      {/* ── Page Title ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">ស្រង់អវត្តមានប្រចាំថ្ងៃ</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            ចុះវត្តមានសិស្សសម្រាប់ថ្នាក់ Homeroom
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200
                          text-green-700 rounded-xl px-4 py-2.5 text-sm font-medium">
            <span className="material-icons text-green-500 text-lg">check_circle</span>
            រក្សាទុកវត្តមានជោគជ័យ!
          </div>
        )}
      </div>

      {/* ── No Homeroom Warning ── */}
      {myData && !homeroom && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200
                        rounded-xl px-5 py-4">
          <span className="material-icons text-amber-500 text-2xl flex-shrink-0 mt-0.5">
            warning_amber
          </span>
          <div>
            <p className="font-bold text-amber-800 text-sm">
              អ្នកមិនទាន់ត្រូវបានចាត់តាំងជា Homeroom Teacher នៅឡើយ
            </p>
            <p className="text-amber-600 text-xs mt-1">
              សូមទាក់ទងអ្នកគ្រប់គ្រង (Admin) ដើម្បីចាត់តាំង Homeroom ទៅឲ្យអ្នក
            </p>
          </div>
        </div>
      )}

      {/* ── Controls Card ── */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="input-label">
                <span className="material-icons text-sm align-middle mr-1">meeting_room</span>
                ថ្នាក់ Homeroom
              </label>
              <select className="input-field"
                value={selected}
                onChange={e => setSelected(e.target.value)}>
                <option value="">-- ជ្រើសថ្នាក់ --</option>
                {homeroom && (
                  <option value={homeroom.id}>
                    {homeroom.name} — {homeroom.grade?.name}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="input-label">
                <span className="material-icons text-sm align-middle mr-1">calendar_today</span>
                កាលបរិច្ឆេទ
              </label>
              <input type="date" className="input-field"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)} />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <div className="flex gap-2">
                <button onClick={() => markAll('present')}
                  disabled={students.length === 0}
                  className="btn-secondary flex-1 text-sm py-2">
                  <span className="material-icons text-base">done_all</span>
                  <span>គ្រប់វត្តមាន</span>
                </button>
                <button onClick={() => markAll('absent')}
                  disabled={students.length === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm
                             py-2 px-3 rounded-lg border border-red-200 text-red-500
                             bg-red-50 hover:bg-red-100 transition-colors">
                  <span className="material-icons text-base">remove_done</span>
                  <span>គ្រប់អវត្តមាន</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'present', label: 'វត្តមាន',   icon: 'check_circle',    bg: 'bg-green-500',  light: 'bg-green-50 border-green-200'  },
            { key: 'absent',  label: 'អវត្តមាន',  icon: 'cancel',          bg: 'bg-red-500',    light: 'bg-red-50 border-red-200'      },
            { key: 'leave',   label: 'ច្បាប់',    icon: 'event_available', bg: 'bg-blue-500',   light: 'bg-blue-50 border-blue-200'    },
            { key: 'late',    label: 'យឺត',       icon: 'schedule',        bg: 'bg-yellow-500', light: 'bg-yellow-50 border-yellow-200' },
          ].map(s => (
            <div key={s.key} className={`card border ${s.light} p-4 flex items-center gap-3`}>
              <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center
                              justify-center flex-shrink-0 shadow-sm`}>
                <span className="material-icons text-white text-xl">{s.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{summary[s.key]}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Attendance Table ── */}
      {selected ? (
        <div className="card">
          {/* Card Header */}
          <div className="card-header">
            <div>
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <span className="material-icons text-blue-600 text-xl">fact_check</span>
                បញ្ជីវត្តមាន
              </h3>
              {homeroom && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {homeroom.name} · {todayKH}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-blue">
                <span className="material-icons text-xs">groups</span>
                {students.length} នាក់
              </span>
              <button onClick={handleSave}
                disabled={saving || students.length === 0}
                className="btn-primary text-sm px-4 py-2">
                {saving ? <><Spinner /><span>រក្សាទុក...</span></> : (
                  <><span className="material-icons text-lg">save</span>
                    <span>រក្សាទុកទិន្នន័យ</span></>
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="relative max-w-xs">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="input-field pl-10 py-2 text-sm"
                placeholder="ស្វែងរកសិស្ស..."
                value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <Spinner />
              <span className="text-sm">កំពុងផ្ទុក...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="material-icons text-5xl mb-3 text-gray-200">school</span>
              <p className="text-sm">គ្មានសិស្សក្នុងថ្នាក់នេះ</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-th w-10">#</th>
                    <th className="table-th">សិស្ស</th>
                    <th className="table-th text-center" style={{ minWidth: 340 }}>
                      ស្ថានភាពវត្តមាន
                    </th>
                    <th className="table-th" style={{ minWidth: 180 }}>
                      កំណត់ចំណាំ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const cur = records[s.id] || 'present'
                    const opt = STATUS_OPTIONS.find(o => o.value === cur)
                    return (
                      <tr key={s.id}
                        className={`border-b border-gray-50 transition-colors duration-100
                          ${opt?.row || ''}`}>
                        <td className="table-td text-gray-400 text-xs w-10">{i + 1}</td>
                        <td className="table-td">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center
                                            justify-center flex-shrink-0
                              ${s.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                              <span className={`material-icons text-lg
                                ${s.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                                person
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm leading-tight">
                                {s.name_kh}
                              </p>
                              <p className="text-xs text-gray-400 font-mono mt-0.5">
                                {s.student_code}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-td">
                          <div className="flex items-center gap-2 flex-wrap">
                            {STATUS_OPTIONS.map(opt => (
                              <button key={opt.value}
                                onClick={() => setStatus(s.id, opt.value)}
                                className={`flex items-center gap-1.5 px-3 py-1.5
                                            rounded-lg border text-xs font-semibold
                                            transition-all duration-150
                                            ${cur === opt.value ? opt.active : opt.inactive}`}>
                                <span className="material-icons text-sm">{opt.icon}</span>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="table-td">
                          <input className="input-field text-xs py-1.5"
                            placeholder="កំណត់ចំណាំ..."
                            value={notes[s.id] || ''}
                            onChange={e => setNote(s.id, e.target.value)} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {students.length > 0 && (
            <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50
                            flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-5 text-xs text-gray-500">
                {[
                  { l: 'វត្តមាន',   v: summary.present, c: 'text-green-600 font-bold'  },
                  { l: 'អវត្តមាន',  v: summary.absent,  c: 'text-red-500 font-bold'    },
                  { l: 'ច្បាប់',    v: summary.leave,   c: 'text-blue-600 font-bold'   },
                  { l: 'យឺត',      v: summary.late,    c: 'text-yellow-600 font-bold'  },
                ].map(s => (
                  <span key={s.l}>{s.l}: <span className={s.c}>{s.v}</span></span>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving}
                className="btn-primary text-sm">
                <span className="material-icons text-lg">save</span>
                <span>រក្សាទុកទិន្នន័យ</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="material-icons text-7xl mb-4 text-gray-200">fact_check</span>
          <p className="text-base font-semibold">ជ្រើសរើសថ្នាក់ និងកាលបរិច្ឆេទ</p>
          <p className="text-sm mt-1.5">ដើម្បីចាប់ផ្តើមស្រង់វត្តមាន</p>
        </div>
      )}
    </div>
  )
}