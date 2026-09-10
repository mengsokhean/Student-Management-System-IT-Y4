import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../lib/axios'

function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

const gradeCfg = (avg) => {
  const n = Number(avg)
  if (n >= 90) return { g: 'A', label: 'ល្អប្រសើរ',   cls: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' }
  if (n >= 75) return { g: 'B', label: 'ល្អ',           cls: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200'       }
  if (n >= 50) return { g: 'C', label: 'គ្រប់គ្រាន់',  cls: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200'   }
  return              { g: 'D', label: 'មិនគ្រប់',      cls: 'text-red-600',    bg: 'bg-red-50 border-red-200'         }
}

const DEMO_RESULT = {
  student: {
    student_code:  'STU-012',
    name_kh:       'ហេង ស្រីនិច',
    name_en:       'Heng Srey Nich',
    gender:        'female',
    date_of_birth: '2007-03-15',
  },
  classroom: {
    name:          '12A',
    grade:         'ថ្នាក់ទី ១២',
    track:         'social_science',
    academic_year: '2024-2025',
    semester:      '1',
  },
  scores: [
    { subject: 'ភាសាខ្មែរ',     m1: 78, m2: 82, m3: 75, m4: 80, exam: 77 },
    { subject: 'ភាសាអង់គ្លេស',  m1: 65, m2: 70, m3: 62, m4: 68, exam: 66 },
    { subject: 'ប្រវត្តិវិទ្យា', m1: 80, m2: 85, m3: 78, m4: 82, exam: 81 },
    { subject: 'ភូមិវិទ្យា',      m1: 72, m2: 75, m3: 70, m4: 74, exam: 73 },
    { subject: 'ពលរដ្ឋ-សីលធម៌', m1: 88, m2: 90, m3: 85, m4: 87, exam: 88 },
  ],
  attendance: { present: 88, absent: 5, late: 2, leave: 1, total: 96 },
  class_rank:     8,
  total_students: 45,
  teacher_comment:  'សិស្សសព្វចិត្ត ស្វែងយល់ ហើយមានឥរិយាបថល្អ។ ខិតខំបន្ថែមទៀតក្នុងមុខវិជ្ជាភាសាអង់គ្លេស។',
  behavior_comment: 'ប្រព្រឹត្តល្អ ស្ដាប់ការណែនាំ សហការជាមួយមិត្ត។',
}

const calcAvg = (r) =>
  ((r.m1 + r.m2 + r.m3 + r.m4 + r.exam * 2) / 6).toFixed(1)

const TRACK_LABEL = {
  science:        'វិទ្យាសាស្ត្រពិត',
  social_science: 'វិទ្យាសាស្ត្រសង្គម',
  '':             'ទូទៅ',
}

export default function ResultDisplayPage() {
  const navigate   = useNavigate()
  const printRef   = useRef()
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    const token     = sessionStorage.getItem('result_token')
    const studentId = sessionStorage.getItem('result_student_id')

    if (!token || !studentId) {
      navigate('/results', { replace: true })
      return
    }

    const loadResult = async () => {
      try {
        const res = await api.get(`/public/student-result/${studentId}`, {
          headers: { 'X-Result-Token': token },
        })
        setResult(res.data)
      } catch (err) {
        // Fallback to demo for development
        if (process.env.NODE_ENV === 'development') {
          setResult(DEMO_RESULT)
        } else {
          setError('មិនអាចទាញយកលទ្ធផលបាន')
        }
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [navigate])

  const handlePrint = () => {
    window.print()
  }

  const handleNewSearch = () => {
    sessionStorage.removeItem('result_token')
    sessionStorage.removeItem('result_student_id')
    navigate('/results')
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4
                    bg-gray-50">
      <Spinner />
      <p className="text-gray-500 text-sm">កំពុងទាញយកលទ្ធផល...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4
                    bg-gray-50 px-4">
      <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center
                      justify-center">
        <span className="material-icons text-red-500 text-4xl">error_outline</span>
      </div>
      <p className="text-gray-800 font-bold text-xl">{error}</p>
      <button onClick={handleNewSearch} className="btn-primary">
        <span className="material-icons text-lg">arrow_back</span>
        <span>ស្វែងរកម្ដងទៀត</span>
      </button>
    </div>
  )

  if (!result) return null

  const { student, classroom, scores, attendance, class_rank,
          total_students, teacher_comment, behavior_comment } = result

  const overallAvg = (
    scores.reduce((sum, r) => sum + Number(calcAvg(r)), 0) / scores.length
  ).toFixed(1)

  const overallCfg  = gradeCfg(overallAvg)
  const passCount   = scores.filter(r => Number(calcAvg(r)) >= 50).length
  const attPct      = Math.round((attendance.present / attendance.total) * 100)

  const MONTHS = ['ខែ១', 'ខែ២', 'ខែ៣', 'ខែ៤']

  return (
    <>
      {/* Print styles — only active during print */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-container { max-width: 100% !important; padding: 0 !important; }
          body { font-family: 'Kantumruy Pro', sans-serif; }
        }
      `}</style>

      <div className="bg-gray-50 min-h-screen py-6 px-4"
        style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>
        <div className="max-w-4xl mx-auto space-y-5 print-container" ref={printRef}>

          {/* Action Bar — no-print */}
          <div className="no-print flex items-center justify-between flex-wrap gap-3">
            <button onClick={handleNewSearch}
              className="flex items-center gap-1.5 text-sm text-gray-600
                         hover:text-blue-600 transition-colors">
              <span className="material-icons text-base">arrow_back</span>
              <span>ស្វែងរកថ្មី</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg
                           bg-blue-700 hover:bg-blue-800 text-white text-sm
                           font-semibold transition-colors shadow-sm">
                <span className="material-icons text-base">print</span>
                Print / PDF
              </button>
            </div>
          </div>

          {/* ══ RESULT CARD ══ */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200
                          overflow-hidden">

            {/* Header — School Branding */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900
                            px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center
                                  justify-center flex-shrink-0 shadow-md">
                    <span className="material-icons text-blue-800 text-3xl">school</span>
                  </div>
                  <div>
                    <p className="font-bold text-xl">NIEI High School</p>
                    <p className="text-blue-200 text-sm">រាជធានីភ្នំពេញ · MoEYS</p>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-blue-200 text-xs uppercase tracking-wider">
                    លទ្ធផលសិក្សា
                  </p>
                  <p className="text-white font-bold text-sm mt-0.5">
                    ឆ្នាំ {classroom.academic_year} · ឆមាស {classroom.semester}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Info Panel */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className={`w-20 h-20 rounded-2xl flex items-center
                                justify-center flex-shrink-0 font-bold text-3xl
                                shadow-sm border-4
                  ${student.gender === 'female'
                    ? 'bg-pink-100 text-pink-600 border-pink-200'
                    : 'bg-blue-100 text-blue-600 border-blue-200'}`}>
                  {student.name_kh.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {student.name_kh}
                      </p>
                      <p className="text-gray-500 text-sm">{student.name_en}</p>
                    </div>
                    {/* Overall Grade Badge */}
                    <div className={`flex flex-col items-center justify-center
                                    w-16 h-16 rounded-2xl border-2 ${overallCfg.bg}
                                    flex-shrink-0`}>
                      <p className={`text-2xl font-bold ${overallCfg.cls}`}>
                        {overallCfg.g}
                      </p>
                      <p className={`text-xs ${overallCfg.cls}`}>{overallCfg.label}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {[
                      { icon: 'badge',        label: 'អត្តសញ្ញាណ', val: student.student_code   },
                      { icon: 'meeting_room', label: 'ថ្នាក់',      val: classroom.name         },
                      { icon: 'school',       label: 'Grade',       val: classroom.grade        },
                      { icon: 'account_tree', label: 'ផ្នែក',       val: TRACK_LABEL[classroom.track] || 'ទូទៅ' },
                    ].map(item => (
                      <div key={item.label}
                        className="flex items-center gap-2 p-2.5 bg-gray-50
                                   rounded-xl border border-gray-100">
                        <span className="material-icons text-blue-500 text-base">
                          {item.icon}
                        </span>
                        <div>
                          <p className="text-xs text-gray-400">{item.label}</p>
                          <p className="font-bold text-gray-800 text-sm">{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0
                            md:divide-x divide-gray-100 border-b border-gray-100">
              {[
                {
                  icon: 'bar_chart',  iconCls: 'text-blue-600',
                  label: 'ពិន្ទុមធ្យម', val: overallAvg,
                  sub: overallCfg.label, subCls: overallCfg.cls,
                },
                {
                  icon: 'check_circle', iconCls: 'text-green-600',
                  label: 'ប្រឡងបាន',   val: `${passCount}/${scores.length}`,
                  sub: 'មុខវិជ្ជា', subCls: 'text-gray-400',
                },
                {
                  icon: 'emoji_events', iconCls: 'text-yellow-500',
                  label: 'ចំណាត់ថ្នាក់', val: `#${class_rank}`,
                  sub: `ក្នុង ${total_students} នាក់`, subCls: 'text-gray-400',
                },
                {
                  icon: 'fact_check', iconCls: 'text-purple-600',
                  label: 'វត្តមាន',    val: `${attPct}%`,
                  sub: `${attendance.present}/${attendance.total} ថ្ងៃ`, subCls: 'text-gray-400',
                },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center
                                  justify-center flex-shrink-0
                    ${s.iconCls.replace('text-', 'bg-').replace('600','100')
                      .replace('500','100').replace('400','100')}`}>
                    <span className={`material-icons text-xl ${s.iconCls}`}>
                      {s.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-xl">{s.val}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-xs font-semibold ${s.subCls}`}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Scores Table ── */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                <span className="material-icons text-blue-600 text-xl">grade</span>
                ពិន្ទុប្រចាំមុខវិជ្ជា — ឆមាស {classroom.semester}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2.5 text-xs font-bold
                                     text-gray-500 uppercase tracking-wider rounded-l-lg">
                        មុខវិជ្ជា
                      </th>
                      {MONTHS.map(m => (
                        <th key={m}
                          className="text-center px-3 py-2.5 text-xs font-bold
                                     text-gray-500 uppercase tracking-wider">
                          {m}
                        </th>
                      ))}
                      <th className="text-center px-3 py-2.5 text-xs font-bold
                                     text-gray-500 uppercase tracking-wider">
                        ប្រឡង
                      </th>
                      <th className="text-center px-3 py-2.5 text-xs font-bold
                                     text-blue-600 uppercase tracking-wider
                                     bg-blue-50 rounded-r-lg">
                        មធ្យម
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {scores.map((row, i) => {
                      const avg     = calcAvg(row)
                      const pass    = Number(avg) >= 50
                      const cfg     = gradeCfg(avg)
                      return (
                        <tr key={i}
                          className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 font-semibold text-gray-800">
                            {row.subject}
                          </td>
                          {[row.m1, row.m2, row.m3, row.m4].map((v, j) => (
                            <td key={j} className="px-3 py-3 text-center
                                                    font-mono text-gray-600">
                              {v}
                            </td>
                          ))}
                          <td className="px-3 py-3 text-center font-mono
                                         text-gray-700 font-semibold">
                            {row.exam}
                          </td>
                          <td className="px-3 py-3 text-center bg-blue-50">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`font-bold text-base ${cfg.cls}`}>
                                {avg}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-md
                                               font-semibold ${cfg.bg} ${cfg.cls}
                                               border`}>
                                {cfg.g}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {/* Footer row */}
                  <tfoot>
                    <tr className="bg-blue-700 text-white">
                      <td className="px-3 py-3 font-bold rounded-l-lg" colSpan={5}>
                        ពិន្ទុមធ្យមសរុប
                      </td>
                      <td className="px-3 py-3" />
                      <td className="px-3 py-3 text-center bg-blue-800 rounded-r-lg">
                        <span className="font-bold text-xl">{overallAvg}</span>
                        <span className={`ml-2 text-sm font-semibold
                                         text-blue-200`}>
                          ({overallCfg.g})
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* ── Attendance Section ── */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                <span className="material-icons text-green-600 text-xl">fact_check</span>
                ស្ថិតិវត្តមាន — ឆមាស {classroom.semester}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: 'ថ្ងៃសរុប',   val: attendance.total,   icon: 'calendar_today',  bg: 'bg-gray-100',    tc: 'text-gray-700'   },
                  { label: 'វត្តមាន',     val: attendance.present, icon: 'check_circle',    bg: 'bg-green-100',   tc: 'text-green-700'  },
                  { label: 'អវត្តមាន',    val: attendance.absent,  icon: 'cancel',          bg: 'bg-red-100',     tc: 'text-red-600'    },
                  { label: 'ច្បាប់',      val: attendance.leave,   icon: 'assignment',      bg: 'bg-blue-100',    tc: 'text-blue-700'   },
                  { label: 'យឺតយ៉ាវ',   val: attendance.late,    icon: 'schedule',        bg: 'bg-yellow-100',  tc: 'text-yellow-700' },
                ].map(s => (
                  <div key={s.label}
                    className={`flex flex-col items-center justify-center
                                rounded-2xl py-4 px-3 ${s.bg}`}>
                    <span className={`material-icons text-2xl mb-1 ${s.tc}`}>
                      {s.icon}
                    </span>
                    <p className={`text-3xl font-bold ${s.tc}`}>{s.val}</p>
                    <p className={`text-xs mt-0.5 ${s.tc} font-medium`}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Attendance Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>ភាគរយវត្តមាន</span>
                  <span className={`font-bold
                    ${attPct >= 80 ? 'text-green-600' :
                      attPct >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {attPct}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all
                      ${attPct >= 80 ? 'bg-green-500' :
                        attPct >= 60 ? 'bg-yellow-400' : 'bg-red-500'}`}
                    style={{ width: `${attPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ── Class Ranking ── */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                <span className="material-icons text-yellow-500 text-xl">emoji_events</span>
                ចំណាត់ថ្នាក់ក្នុងថ្នាក់
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center
                                  justify-center flex-shrink-0 shadow-sm
                    ${class_rank === 1 ? 'bg-yellow-400' :
                      class_rank === 2 ? 'bg-gray-300'   :
                      class_rank === 3 ? 'bg-orange-400'  : 'bg-blue-100'}`}>
                    {class_rank <= 3 ? (
                      <span className="material-icons text-white text-3xl">
                        emoji_events
                      </span>
                    ) : (
                      <span className="font-bold text-blue-700 text-2xl">
                        #{class_rank}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-2xl">
                      ទី {class_rank}
                    </p>
                    <p className="text-gray-500 text-sm">
                      ក្នុចំណោម {total_students} នាក់
                    </p>
                  </div>
                </div>

                {/* Ranking bar */}
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400
                                 rounded-full transition-all"
                      style={{
                        width: `${Math.round(
                          ((total_students - class_rank + 1) / total_students) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>ទី ១</span>
                    <span>ទី {total_students}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Teacher Comments ── */}
            {(teacher_comment || behavior_comment) && (
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                  <span className="material-icons text-purple-600 text-xl">rate_review</span>
                  មតិគ្រូ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teacher_comment && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons text-blue-600 text-base">
                          school
                        </span>
                        <p className="font-bold text-blue-700 text-sm">
                          មតិសិក្សា
                        </p>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {teacher_comment}
                      </p>
                    </div>
                  )}
                  {behavior_comment && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-icons text-green-600 text-base">
                          psychology
                        </span>
                        <p className="font-bold text-green-700 text-sm">
                          មតិឥរិយាបថ
                        </p>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {behavior_comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Official Footer / Signature ── */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-3 gap-6 text-center">
                {['Homeroom Teacher', 'School Principal', 'Date & Stamp'].map((role, i) => (
                  <div key={role} className="flex flex-col items-center">
                    <div className="w-full h-16 border-b-2 border-dashed
                                    border-gray-300 mb-2" />
                    <p className="text-xs text-gray-500 font-medium">{role}</p>
                    {i === 2 && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date().toLocaleDateString('km-KH')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                ឯកសារនេះចេញដោយ NIEI High School ·
                ផ្ទៀងផ្ទាត់ at {window.location.hostname}
              </p>
            </div>
          </div>

          {/* Actions — no-print */}
          <div className="no-print flex items-center justify-center gap-4 pb-8
                          flex-wrap">
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700
                         hover:bg-blue-800 text-white font-semibold transition-colors
                         shadow-md">
              <span className="material-icons">print</span>
              Print / Save PDF
            </button>
            <button onClick={handleNewSearch}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2
                         border-gray-300 text-gray-700 hover:border-blue-400
                         hover:text-blue-700 font-semibold transition-colors">
              <span className="material-icons">search</span>
              ស្វែងរកថ្មី
            </button>
          </div>
        </div>
      </div>
    </>
  )
}