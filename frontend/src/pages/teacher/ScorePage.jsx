import { useEffect, useState } from 'react'
import api from '../../lib/axios'

const MONTHS_KH = [
  '', 'មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា',
  'កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ',
]

const SEM1_MONTHS = [10, 11, 12, 1]
const SEM2_MONTHS = [2,  3,  4,  5]

function Spinner({ cls = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${cls}`} xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

export default function ScorePage() {
  const [myData,      setMyData]      = useState(null)
  const [years,       setYears]       = useState([])
  const [yearId,      setYearId]      = useState('')
  const [semester,    setSemester]    = useState('1')
  const [classroomId, setClassroomId] = useState('')
  const [subjectId,   setSubjectId]   = useState('')
  const [students,    setStudents]    = useState([])
  const [scores,      setScores]      = useState([])
  const [loaded,      setLoaded]      = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [search,      setSearch]      = useState('')

  useEffect(() => {
    api.get('/teacher/my-classrooms').then(r => setMyData(r.data))
    api.get('/admin/academic-years').then(r => {
      setYears(r.data)
      const active = r.data.find(y => y.is_active)
      if (active) setYearId(active.id.toString())
    }).catch(() => {})
  }, [])

  const availableClassrooms = myData?.classrooms || []
  const availableSubjects   = myData?.classrooms
    ?.find(c => c.classroom?.id?.toString() === classroomId)
    ?.subjects || []

  const monthLabels = (semester === '1' ? SEM1_MONTHS : SEM2_MONTHS)
    .map((m, i) => ({ idx: i + 1, field: `month${i + 1}`, label: `ខែ${i + 1}`, kh: MONTHS_KH[m] }))

  useEffect(() => {
    setSubjectId('')
    setScores([])
    setStudents([])
    setLoaded(false)
  }, [classroomId])

  useEffect(() => {
    setLoaded(false)
    setScores([])
  }, [semester])

  const handleLoad = async () => {
    if (!classroomId || !subjectId || !yearId) return
    setLoading(true)
    setLoaded(false)
    try {
      const [stuRes, scoreRes] = await Promise.all([
        api.get(`/teacher/classrooms/${classroomId}/students`),
        api.get('/teacher/scores', {
          params: { classroom_id: classroomId, subject_id: subjectId,
                    academic_year_id: yearId, semester },
        }),
      ])
      setStudents(stuRes.data)
      const scoreMap = {}
      scoreRes.data.forEach(s => { scoreMap[s.student?.id] = s })
      setScores(stuRes.data.map(s => {
        const ex = scoreMap[s.id]
        return {
          student_id: s.id,
          month1:     ex?.month1     ?? '',
          month2:     ex?.month2     ?? '',
          month3:     ex?.month3     ?? '',
          month4:     ex?.month4     ?? '',
          exam_score: ex?.exam_score ?? '',
        }
      }))
      setLoaded(true)
    } catch (_) {}
    setLoading(false)
  }

  const updateScore = (sid, field, val) => {
    if (val !== '' && (Number(val) < 0 || Number(val) > 100)) return
    setScores(prev => prev.map(s =>
      s.student_id === sid ? { ...s, [field]: val } : s
    ))
  }

  const calcAvg = (row) => {
    const vals = [row.month1, row.month2, row.month3, row.month4, row.exam_score]
    if (vals.some(v => v === '' || v === null || v === undefined)) return null
    const [m1, m2, m3, m4, ex] = vals.map(Number)
    return ((m1 + m2 + m3 + m4 + ex * 2) / 6).toFixed(2)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await api.post('/teacher/scores/bulk', {
        classroom_id: classroomId, subject_id: subjectId,
        academic_year_id: yearId, semester,
        scores: scores.map(s => ({
          student_id: s.student_id,
          month1:     s.month1     !== '' ? Number(s.month1)     : null,
          month2:     s.month2     !== '' ? Number(s.month2)     : null,
          month3:     s.month3     !== '' ? Number(s.month3)     : null,
          month4:     s.month4     !== '' ? Number(s.month4)     : null,
          exam_score: s.exam_score !== '' ? Number(s.exam_score) : null,
        })),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (_) {}
    setSaving(false)
  }

  const selectedSubjectName = availableSubjects
    .find(s => s.id?.toString() === subjectId)?.name_kh

  const selectedClassName = availableClassrooms
    .find(c => c.classroom?.id?.toString() === classroomId)?.classroom?.name

  const filtered = students.filter(s =>
    s.name_kh.includes(search) ||
    s.student_code.toLowerCase().includes(search.toLowerCase())
  )

  // Stats
  const allAvgs = scores.map(r => calcAvg(r)).filter(v => v !== null).map(Number)
  const classAvg = allAvgs.length
    ? (allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length).toFixed(2) : null
  const passCount = allAvgs.filter(v => v >= 50).length
  const failCount = allAvgs.filter(v => v <  50).length

  const inp = `w-14 border border-gray-200 rounded-lg px-1 py-1.5 text-center
               text-sm font-mono focus:outline-none focus:ring-2
               focus:ring-blue-400 focus:border-transparent transition-all`

  return (
    <div className="space-y-5">

      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">បញ្ចូលពិន្ទុ</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បញ្ចូលពិន្ទុប្រចាំខែ និងពិន្ទុប្រឡង
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200
                          text-green-700 rounded-xl px-4 py-2.5 text-sm font-medium">
            <span className="material-icons text-green-500 text-lg">check_circle</span>
            រក្សាទុកពិន្ទុជោគជ័យ!
          </div>
        )}
      </div>

      {/* Filter Card */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <span className="material-icons text-blue-600 text-xl">tune</span>
            <h3 className="font-bold text-gray-800 text-sm">ជ្រើសរើស</h3>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="input-label">ឆ្នាំសិក្សា</label>
              <select className="input-field" value={yearId}
                onChange={e => { setYearId(e.target.value); setLoaded(false) }}>
                <option value="">-- ជ្រើស --</option>
                {years.map(y => (
                  <option key={y.id} value={y.id}>{y.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">វគ្គ</label>
              <select className="input-field" value={semester}
                onChange={e => setSemester(e.target.value)}>
                <option value="1">វគ្គទី ១</option>
                <option value="2">វគ្គទី ២</option>
              </select>
            </div>
            <div>
              <label className="input-label">ថ្នាក់</label>
              <select className="input-field" value={classroomId}
                onChange={e => { setClassroomId(e.target.value); setLoaded(false) }}>
                <option value="">-- ជ្រើស --</option>
                {availableClassrooms.map(c => (
                  <option key={c.classroom?.id} value={c.classroom?.id}>
                    {c.classroom?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">មុខវិជ្ជា</label>
              <select className="input-field" value={subjectId}
                onChange={e => { setSubjectId(e.target.value); setLoaded(false) }}
                disabled={!classroomId}>
                <option value="">-- ជ្រើស --</option>
                {availableSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name_kh}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleLoad}
                disabled={!classroomId || !subjectId || !yearId || loading}
                className="btn-primary w-full">
                {loading
                  ? <><Spinner /><span>ផ្ទុក...</span></>
                  : <><span className="material-icons text-lg">search</span>
                     <span>ផ្ទុកទិន្នន័យ</span></>
                }
              </button>
            </div>
          </div>

          {/* Formula hint */}
          <div className="mt-4 flex items-start gap-2 bg-blue-50 border border-blue-100
                          rounded-lg px-4 py-3">
            <span className="material-icons text-blue-500 text-base flex-shrink-0 mt-0.5">
              info
            </span>
            <p className="text-xs text-blue-600 leading-relaxed">
              <strong>រូបមន្ត:</strong>&nbsp;
              មធ្យម = ((ខែ១ + ខែ២ + ខែ៣ + ខែ៤) + (ពិន្ទុប្រឡង × ២)) ÷ ៦
              &nbsp;·&nbsp; ពិន្ទុអប្បបរមា <strong>50</strong> ដើម្បីជាប់
            </p>
          </div>
        </div>
      </div>

      {/* Class Stats */}
      {loaded && students.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'សិស្សទាំងអស់', val: students.length,
              icon: 'groups',       bg: 'bg-blue-500'   },
            { label: 'មធ្យមថ្នាក់',  val: classAvg ?? '—',
              icon: 'bar_chart',    bg: 'bg-indigo-500' },
            { label: 'ជាប់',         val: passCount,
              icon: 'check_circle', bg: 'bg-green-500'  },
            { label: 'គ្រប់',        val: failCount,
              icon: 'cancel',       bg: 'bg-red-500'    },
          ].map(s => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
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
      )}

      {/* Score Table */}
      {loaded && students.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <span className="material-icons text-blue-600 text-xl">grade</span>
                ពិន្ទុ — {selectedSubjectName}
                <span className="text-gray-400 font-normal">· {selectedClassName} · វគ្គ {semester}</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="material-icons absolute left-2.5 top-1/2 -translate-y-1/2
                                 text-gray-400 text-base">search</span>
                <input className="border border-gray-200 rounded-lg pl-8 pr-3 py-1.5
                                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="ស្វែងរក..."
                  value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <button onClick={handleSave} disabled={saving}
                className="btn-primary text-sm">
                {saving
                  ? <><Spinner /><span>រក្សាទុក...</span></>
                  : <><span className="material-icons text-lg">save</span>
                     <span>រក្សាទុក</span></>
                }
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th w-8">#</th>
                  <th className="table-th">សិស្ស</th>
                  {monthLabels.map(m => (
                    <th key={m.field} className="table-th text-center">
                      <div className="flex flex-col items-center leading-tight">
                        <span>{m.label}</span>
                        <span className="text-gray-400 font-normal normal-case text-xs">
                          {m.kh}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="table-th text-center">
                    <div className="flex flex-col items-center leading-tight">
                      <span>ប្រឡង</span>
                      <span className="text-gray-400 font-normal normal-case text-xs">×២</span>
                    </div>
                  </th>
                  <th className="table-th text-center bg-blue-50 text-blue-700">មធ្យម</th>
                  <th className="table-th text-center bg-blue-50 text-blue-700">លទ្ធផល</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const row  = scores.find(r => r.student_id === s.id)
                  const avg  = row ? calcAvg(row) : null
                  const pass = avg !== null && Number(avg) >= 50
                  return (
                    <tr key={s.id} className="table-tr-hover">
                      <td className="table-td text-gray-400 text-xs">{i + 1}</td>
                      <td className="table-td">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center
                                          justify-center flex-shrink-0
                            ${s.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                            <span className={`material-icons text-base
                              ${s.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                              person
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm leading-tight">
                              {s.name_kh}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">{s.student_code}</p>
                          </div>
                        </div>
                      </td>
                      {['month1','month2','month3','month4','exam_score'].map(field => (
                        <td key={field} className="table-td text-center px-2">
                          <input type="number" min={0} max={100} step={0.5}
                            className={inp}
                            value={row?.[field] ?? ''}
                            placeholder="—"
                            onChange={e => updateScore(s.id, field, e.target.value)} />
                        </td>
                      ))}
                      <td className="table-td text-center bg-blue-50 px-3">
                        <span className={`font-bold text-base ${
                          avg === null ? 'text-gray-300' :
                          pass ? 'text-green-600' : 'text-red-500'}`}>
                          {avg ?? '—'}
                        </span>
                      </td>
                      <td className="table-td text-center bg-blue-50">
                        {avg === null
                          ? <span className="text-gray-300 text-xs">—</span>
                          : pass
                          ? <span className="badge badge-green">
                              <span className="material-icons text-xs">check_circle</span>ជាប់
                            </span>
                          : <span className="badge badge-red">
                              <span className="material-icons text-xs">cancel</span>គ្រប់
                            </span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>

              {/* Footer Row */}
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-800 text-white">
                    <td colSpan={7} className="px-4 py-3 text-sm font-bold text-right">
                      មធ្យមថ្នាក់
                    </td>
                    <td className="px-4 py-3 text-center bg-blue-700">
                      <span className="font-bold text-base text-white">
                        {classAvg ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs text-slate-300">
                        ជាប់: {passCount} · គ្រប់: {failCount}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
              <span className="material-icons text-lg">save</span>
              <span>រក្សាទុកពិន្ទុ</span>
            </button>
          </div>
        </div>
      )}

      {!loaded && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="material-icons text-7xl mb-4 text-gray-200">grade</span>
          <p className="text-base font-semibold">ជ្រើសរើសថ្នាក់ មុខវិជ្ជា និងវគ្គ</p>
          <p className="text-sm mt-1.5">បន្ទាប់មកចុច "ផ្ទុកទិន្នន័យ"</p>
        </div>
      )}
    </div>
  )
}