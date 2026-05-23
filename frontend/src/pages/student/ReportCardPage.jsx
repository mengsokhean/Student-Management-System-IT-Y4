import { useEffect, useRef, useState } from 'react'
import api from '../../lib/axios'

const MONTHS_KH = [
  '','មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា',
  'កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ',
]

const getGrade = (avg) => {
  if (avg === null || avg === undefined) return { g: '—', label: '—', cls: 'text-gray-400', pass: null }
  const n = Number(avg)
  if (n >= 90) return { g: 'A', label: 'ល្អប្រសើរណាស់', cls: 'text-emerald-600', pass: true  }
  if (n >= 75) return { g: 'B', label: 'ល្អ',           cls: 'text-blue-600',   pass: true  }
  if (n >= 50) return { g: 'C', label: 'គ្រប់គ្រាន់',   cls: 'text-yellow-600', pass: true  }
  return              { g: 'D', label: 'មិនគ្រប់',      cls: 'text-red-600',    pass: false }
}

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

export default function ReportCardPage() {
  const [years,    setYears]    = useState([])
  const [yearId,   setYearId]   = useState('')
  const [semester, setSemester] = useState('')
  const [data,     setData]     = useState(null)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    api.get('/admin/academic-years').then(r => {
      setYears(r.data)
      const active = r.data.find(y => y.is_active)
      if (active) setYearId(active.id.toString())
    }).catch(() => {})
  }, [])

  const handleLoad = async () => {
    if (!yearId) return
    setLoading(true)
    setData(null)
    try {
      const res = await api.get('/student/report-card', {
        params: { academic_year_id: yearId, semester: semester || undefined },
      })
      setData(res.data)
    } catch (_) {}
    setLoading(false)
  }

  const overallGrade = getGrade(data?.overall_avg)
  const passCount    = data?.scores?.filter(s => {
    const avg = semester ? s.semester_avg : s.annual_avg
    return avg !== null && Number(avg) >= 50
  }).length ?? 0
  const failCount    = (data?.scores?.length ?? 0) - passCount

  return (
    <div className="space-y-5">

      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">ព្រឹត្តិបត្រពិន្ទុ</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            លទ្ធផលសិក្សា{semester ? ` — វគ្គទី ${semester}` : ' — ប្រចាំឆ្នាំ'}
          </p>
        </div>
        {data && (
          <button onClick={() => window.print()} className="btn-secondary">
            <span className="material-icons text-lg">print</span>
            <span>បោះពុម្ព</span>
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="input-label">ឆ្នាំសិក្សា</label>
              <select className="input-field w-44"
                value={yearId}
                onChange={e => setYearId(e.target.value)}>
                <option value="">-- ជ្រើស --</option>
                {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">វគ្គ</label>
              <select className="input-field w-44"
                value={semester}
                onChange={e => setSemester(e.target.value)}>
                <option value="">ទាំងឆ្នាំ (Annual)</option>
                <option value="1">វគ្គទី ១</option>
                <option value="2">វគ្គទី ២</option>
              </select>
            </div>
            <button onClick={handleLoad} disabled={!yearId || loading}
              className="btn-primary">
              {loading
                ? <><Spinner /><span>ផ្ទុក...</span></>
                : <><span className="material-icons text-lg">summarize</span>
                   <span>មើលព្រឹត្តិបត្រ</span></>
              }
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Spinner /><span className="text-sm">កំពុងផ្ទុក...</span>
        </div>
      )}

      {/* ══ Report Card ══ */}
      {data && !loading && (
        <div className="space-y-5">

          {/* Official Header */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-blue-900 px-6 py-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center
                                  justify-center shadow-lg flex-shrink-0">
                    <span className="material-icons text-blue-800 text-3xl">school</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl leading-tight">
                      ព្រះរាជាណាចក្រកម្ពុជា
                    </p>
                    <p className="text-blue-300 text-sm">ជាតិ · សាសនា · ព្រះមហាក្សត្រ</p>
                    <p className="text-blue-100 text-sm font-semibold mt-1">
                      វិទ្យាល័យហ៊ុនសែន — ខេត្តព្រះសីហនុ
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-300 text-xs uppercase tracking-widest">
                    ព្រឹត្តិបត្រពិន្ទុ
                  </p>
                  <p className="text-white font-bold text-2xl">
                    {semester ? `វគ្គទី ${semester}` : 'ប្រចាំឆ្នាំ'}
                  </p>
                  <p className="text-blue-200 text-sm">
                    {years.find(y => y.id?.toString() === yearId)?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Info Grid */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { icon: 'badge',        label: 'លេខសម្គាល់',    val: data.student.student_code },
                  { icon: 'person',       label: 'ឈ្មោះ (ខ្មែរ)',  val: data.student.name_kh      },
                  { icon: 'translate',    label: 'ឈ្មោះ (EN)',     val: data.student.name_en      },
                  { icon: 'wc',           label: 'ភេទ',
                    val: data.student.gender === 'male' ? 'ប្រុស' : 'ស្រី' },
                  { icon: 'meeting_room', label: 'ថ្នាក់',         val: data.classroom.name       },
                  { icon: 'school',       label: 'ថ្នាក់ទី',       val: data.classroom.grade      },
                  { icon: 'public',       label: 'ជំនាញ',
                    val: data.classroom.track === 'science'       ? 'វិទ្យាសាស្ត្រពិត'
                       : data.classroom.track === 'social_science'? 'វិទ្យាសាស្ត្រសង្គម'
                       : 'ទូទៅ' },
                  { icon: 'event_note',   label: 'ឆ្នាំសិក្សា',   val: data.classroom.academic_year },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center
                                    justify-center flex-shrink-0">
                      <span className="material-icons text-blue-600 text-base">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-bold text-gray-800">{item.val || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Result */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Big Average */}
                <div className={`col-span-2 md:col-span-1 rounded-2xl p-5 text-center border-2
                  ${overallGrade.pass === true  ? 'bg-green-50 border-green-300'  :
                    overallGrade.pass === false ? 'bg-red-50 border-red-300'      :
                    'bg-gray-50 border-gray-200'}`}>
                  <p className="text-xs text-gray-500 mb-2">មធ្យមសរុប</p>
                  <p className={`text-4xl font-bold ${overallGrade.cls}`}>
                    {data.overall_avg ?? '—'}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${overallGrade.cls}`}>
                    {overallGrade.g}
                  </p>
                  <p className={`text-xs font-semibold mt-1 ${overallGrade.cls}`}>
                    {overallGrade.label}
                  </p>
                </div>

                {[
                  { icon: 'menu_book',     label: 'មុខវិជ្ជា',
                    val: data.scores?.length ?? 0,  bg: 'bg-blue-500'   },
                  { icon: 'check_circle',  label: 'ជាប់',
                    val: passCount,                  bg: 'bg-green-500'  },
                  { icon: 'cancel',        label: 'គ្រប់',
                    val: failCount,                  bg: 'bg-red-500'    },
                  { icon: 'event_available', label: 'ថ្ងៃវត្តមាន',
                    val: data.attendance?.present ?? 0, bg: 'bg-purple-500' },
                ].map(s => (
                  <div key={s.label}
                    className="rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center
                                    justify-center flex-shrink-0 shadow-sm`}>
                      <span className="material-icons text-white text-xl">{s.icon}</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">{s.val}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Score Table */}
          <div className="card overflow-hidden">
            <div className="card-header bg-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="material-icons text-blue-300 text-xl">grade</span>
                តារាងពិន្ទុ{semester ? ` — វគ្គទី ${semester}` : ' — ប្រចាំឆ្នាំ'}
              </h3>
              <span className="text-xs text-slate-400">
                {data.scores?.length ?? 0} មុខវិជ្ជា
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="table-th w-8">#</th>
                    <th className="table-th">មុខវិជ្ជា</th>
                    {!semester ? (
                      <>
                        <th className="table-th text-center">វគ្គ១</th>
                        <th className="table-th text-center">វគ្គ២</th>
                        <th className="table-th text-center bg-blue-50 text-blue-700">
                          ប្រចាំឆ្នាំ
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="table-th text-center">ខែ១</th>
                        <th className="table-th text-center">ខែ២</th>
                        <th className="table-th text-center">ខែ៣</th>
                        <th className="table-th text-center">ខែ៤</th>
                        <th className="table-th text-center">ប្រឡង</th>
                        <th className="table-th text-center bg-blue-50 text-blue-700">
                          មធ្យម
                        </th>
                      </>
                    )}
                    <th className="table-th text-center">Grade</th>
                    <th className="table-th text-center">លទ្ធផល</th>
                  </tr>
                </thead>
                <tbody>
                  {data.scores?.map((row, i) => {
                    const avg   = semester ? row.semester_avg : row.annual_avg
                    const grade = getGrade(avg)
                    return (
                      <tr key={i}
                        className={`border-b border-gray-50
                          ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">{row.subject.name_kh}</p>
                          <p className="text-xs text-gray-400">{row.subject.name_en}</p>
                        </td>
                        {!semester ? (
                          <>
                            <td className="px-4 py-3 text-center font-mono text-gray-600">
                              {row.semester1?.semester_avg ?? '—'}
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-gray-600">
                              {row.semester2?.semester_avg ?? '—'}
                            </td>
                            <td className="px-4 py-3 text-center bg-blue-50">
                              <span className={`font-bold text-base ${grade.cls}`}>
                                {avg ?? '—'}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            {['month1','month2','month3','month4'].map(f => (
                              <td key={f} className="px-4 py-3 text-center font-mono text-gray-600">
                                {row[f] ?? '—'}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-center font-mono text-gray-600">
                              {row.exam_score ?? '—'}
                            </td>
                            <td className="px-4 py-3 text-center bg-blue-50">
                              <span className={`font-bold text-base ${grade.cls}`}>
                                {avg ?? '—'}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold text-lg ${grade.cls}`}>{grade.g}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {avg === null
                            ? <span className="text-gray-300 text-xs">—</span>
                            : grade.pass
                            ? <span className="badge badge-green">
                                <span className="material-icons text-xs">check_circle</span>
                                ជាប់
                              </span>
                            : <span className="badge badge-red">
                                <span className="material-icons text-xs">cancel</span>
                                គ្រប់
                              </span>
                          }
                        </td>
                      </tr>
                    )
                  })}

                  {/* Total Row */}
                  <tr className="bg-slate-800 text-white">
                    <td colSpan={semester ? 7 : 4}
                      className="px-4 py-3 font-bold text-sm text-right">
                      មធ្យមសរុប
                    </td>
                    <td className="px-4 py-3 text-center bg-blue-700">
                      <span className="font-bold text-xl text-white">
                        {data.overall_avg ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold text-lg ${
                        overallGrade.pass === true  ? 'text-green-300' :
                        overallGrade.pass === false ? 'text-red-300'   : 'text-gray-400'}`}>
                        {overallGrade.g}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {overallGrade.pass === true
                        ? <span className="badge bg-green-400 text-green-900 font-bold">
                            <span className="material-icons text-xs">check_circle</span>ជាប់
                          </span>
                        : overallGrade.pass === false
                        ? <span className="badge bg-red-400 text-red-900 font-bold">
                            <span className="material-icons text-xs">cancel</span>គ្រប់
                          </span>
                        : <span className="text-gray-400 text-xs">—</span>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <span className="material-icons text-purple-600 text-xl">event_note</span>
                <h3 className="font-bold text-gray-800 text-sm">វត្តមានប្រចាំឆ្នាំ</h3>
              </div>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: 'ថ្ងៃវត្តមាន',   k: 'present', icon: 'check_circle',
                    bg: 'bg-green-500', light: 'bg-green-50 border-green-200' },
                  { l: 'ថ្ងៃអវត្តមាន',  k: 'absent',  icon: 'cancel',
                    bg: 'bg-red-500',   light: 'bg-red-50 border-red-200'     },
                  { l: 'ថ្ងៃច្បាប់',    k: 'leave',   icon: 'event_available',
                    bg: 'bg-blue-500',  light: 'bg-blue-50 border-blue-200'   },
                  { l: 'ថ្ងៃយឺត',       k: 'late',    icon: 'schedule',
                    bg: 'bg-yellow-500', light: 'bg-yellow-50 border-yellow-200' },
                ].map(a => (
                  <div key={a.k}
                    className={`rounded-xl border p-4 flex items-center gap-3
                      ${a.light}`}>
                    <div className={`w-10 h-10 ${a.bg} rounded-xl flex items-center
                                    justify-center flex-shrink-0 shadow-sm`}>
                      <span className="material-icons text-white text-xl">{a.icon}</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800">
                        {data.attendance?.[a.k] ?? 0}
                      </p>
                      <p className="text-xs text-gray-500">{a.l}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Signatures */}
          <div className="card">
            <div className="card-body">
              <div className="grid grid-cols-3 gap-8 text-center">
                {['គ្រូប្រចាំថ្នាក់', 'នាយករង', 'នាយកវិទ្យាល័យ'].map(title => (
                  <div key={title}>
                    <p className="font-bold text-gray-700 text-sm">{title}</p>
                    <p className="text-xs text-gray-400 mb-12">ហត្ថលេខា និងឈ្មោះ</p>
                    <div className="border-t border-dashed border-gray-300 pt-2">
                      <p className="text-xs text-gray-300">
                        ........................................
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {!data && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="material-icons text-7xl mb-4 text-gray-200">summarize</span>
          <p className="text-base font-semibold">ជ្រើសរើសឆ្នាំសិក្សា</p>
          <p className="text-sm mt-1.5">បន្ទាប់មកចុច "មើលព្រឹត្តិបត្រ"</p>
        </div>
      )}
    </div>
  )
}