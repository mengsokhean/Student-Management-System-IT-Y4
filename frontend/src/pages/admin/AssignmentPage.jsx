import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import Breadcrumb    from '../../components/common/Breadcrumb'
import Pagination    from '../../components/common/Pagination'
import Modal         from '../../components/common/Modal'
import RequiredLabel from '../../components/common/RequiredLabel'

function Spinner({ cls = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${cls}`} fill="none" viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

// Track → Subject mapping (validation rules)
const TRACK_SUBJECT_CODES = {
  science:        ['PHY', 'CHEM', 'BIO', 'AMATH'],
  social_science: ['HIST2', 'GEO2', 'ECON', 'CIVIC2'],
  general:        ['KH', 'EN', 'MATH', 'HIST', 'GEO', 'CIVIC', 'ETHICS', 'PE'],
}

const TRACK_CFG = {
  '':             { label: 'ទូទៅ',             icon: 'school',  cls: 'badge-gray',   bar: 'bg-gray-500'   },
  general:        { label: 'ទូទៅ',             icon: 'school',  cls: 'badge-gray',   bar: 'bg-gray-500'   },
  science:        { label: 'វិទ្យាសាស្ត្រពិត', icon: 'science', cls: 'badge-blue',   bar: 'bg-blue-600'   },
  social_science: { label: 'វិទ្យាសាស្ត្រសង្គម',icon: 'public',  cls: 'badge-purple', bar: 'bg-purple-600' },
}

const SEMESTER_LABEL = { '1': 'ឆមាសទី ១', '2': 'ឆមាសទី ២' }

const EMPTY_FORM = {
  academic_year_id:   '',
  semester:           '1',
  grade_id:           '',
  track:              '',
  classroom_id:       '',
  subject_id:         '',
  teacher_profile_id: '',
}

export default function AssignmentPage() {
  const [assignments, setAssignments] = useState([])
  const [classrooms,  setClassrooms]  = useState([])
  const [teachers,    setTeachers]    = useState([])
  const [subjects,    setSubjects]    = useState([])
  const [years,       setYears]       = useState([])
  const [grades,      setGrades]      = useState([])
  const [fetching,    setFetching]    = useState(true)

  // Filters
  const [filterYear,    setFilterYear]    = useState('')
  const [filterSemester,setFilterSemester]= useState('')
  const [filterGrade,   setFilterGrade]   = useState('')
  const [filterTrack,   setFilterTrack]   = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterTeacher, setFilterTeacher] = useState('')
  const [search,        setSearch]        = useState('')

  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [modalOpen, setModalOpen] = useState(false)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [conflicts, setConflicts] = useState([])

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const fetchAll = async () => {
    setFetching(true)
    try {
      const [cr, tr, su, yr, gr] = await Promise.all([
        api.get('/admin/classrooms'),
        api.get('/admin/teachers'),
        api.get('/admin/subjects'),
        api.get('/admin/academic-years'),
        api.get('/admin/grades'),
      ])
      setClassrooms(cr.data)
      setTeachers(tr.data)
      setSubjects(su.data)
      setYears(yr.data)
      setGrades(gr.data)

      // Build assignment list from classrooms
      const allAsgn = []
      for (const c of cr.data) {
        try {
          const detail = await api.get(`/admin/classrooms/${c.id}`)
          const tcs = detail.data.teacher_class_subjects || []
          tcs.forEach(t => {
            allAsgn.push({
              id:        t.id,
              classroom: c,
              subject:   t.subject,
              teacher:   t.teacher_profile,
              semester:  '1',
              status:    'active',
              created_at: new Date().toLocaleDateString('km-KH'),
            })
          })
        } catch (_) {}
      }
      setAssignments(allAsgn)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchAll() }, [])

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 4000) }

  // Dependent dropdown logic
  const selectedGradeLevel = grades.find(g => g.id == form.grade_id)?.level

  const filteredClassrooms = classrooms.filter(c => {
    if (!form.grade_id) return true
    if (c.grade_id?.toString() !== form.grade_id) return false
    if (selectedGradeLevel === '10') return true
    if (form.track && c.track !== form.track) return false
    return true
  })

  // Subject filtering by track rules
  const getSubjectTrack = (code) => {
    if (TRACK_SUBJECT_CODES.science.includes(code))        return 'science'
    if (TRACK_SUBJECT_CODES.social_science.includes(code)) return 'social_science'
    return 'general'
  }

  const filteredSubjects = subjects.filter(s => {
    if (!form.track && !form.grade_id) return true
    const sTrack = getSubjectTrack(s.code)
    if (selectedGradeLevel === '10') return sTrack === 'general'
    if (form.track === 'science')        return sTrack === 'science'
    if (form.track === 'social_science') return sTrack === 'social_science'
    return true
  })

  // Teacher filtering by expertise
  const filteredTeachers = teachers.filter(t => {
    if (!form.track) return true
    if (!t.subject_expertise) return true // unspecified can teach anything
    if (selectedGradeLevel === '10') return true
    return t.subject_expertise === form.track
  })

  // Conflict detection
  useEffect(() => {
    if (!form.classroom_id || !form.subject_id) {
      setConflicts([]); return
    }
    const existing = assignments.filter(
      a => a.classroom?.id?.toString() === form.classroom_id &&
           a.subject?.id?.toString()   === form.subject_id
    )
    setConflicts(existing)
  }, [form.classroom_id, form.subject_id, assignments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await api.post('/admin/teachers/assign-subject', {
        teacher_profile_id: form.teacher_profile_id,
        classroom_id:       form.classroom_id,
        subject_id:         form.subject_id,
      })
      showSuccess('ចាត់តាំងគ្រូជោគជ័យ!')
      setModalOpen(false); setForm(EMPTY_FORM); fetchAll()
    } catch (err) { setError(err.response?.data?.message || 'មានបញ្ហា') }
    finally { setLoading(false) }
  }

  const handleRemove = async (a) => {
    setDeleting(true)
    try {
      await api.post('/admin/teachers/remove-subject', {
        classroom_id: a.classroom?.id,
        subject_id:   a.subject?.id,
      })
      showSuccess('លុបការចាត់តាំងជោគជ័យ!')
      setDeleteTarget(null); fetchAll()
    } catch (_) {}
    setDeleting(false)
  }

  // Filters
  const filtered = assignments.filter(a => {
    const track = a.classroom?.track || ''
    const matchSearch  = !search ||
      (a.teacher?.name_kh || '').includes(search) ||
      (a.subject?.name_kh || '').includes(search) ||
      (a.classroom?.name  || '').toLowerCase().includes(search.toLowerCase())
    const matchYear    = !filterYear     || a.classroom?.academic_year_id?.toString() === filterYear
    const matchSem     = !filterSemester || a.semester === filterSemester
    const matchGrade   = !filterGrade    || a.classroom?.grade_id?.toString() === filterGrade
    const matchTrack   = !filterTrack    ||
      (filterTrack === 'general' ? !track : track === filterTrack)
    const matchSubject = !filterSubject  || a.subject?.id?.toString() === filterSubject
    const matchTeacher = !filterTeacher  || a.teacher?.id?.toString() === filterTeacher
    return matchSearch && matchYear && matchSem && matchGrade && matchTrack && matchSubject && matchTeacher
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  const sciCount    = assignments.filter(a => a.classroom?.track === 'science').length
  const socialCount = assignments.filter(a => a.classroom?.track === 'social_science').length
  const genCount    = assignments.filter(a => !a.classroom?.track).length

  // Relationship viz data
  const relViz = (() => {
    const tracks = {}
    assignments.forEach(a => {
      const tk = a.classroom?.track || 'general'
      if (!tracks[tk]) tracks[tk] = { subjects: {}, count: 0 }
      const sk = a.subject?.code || '?'
      if (!tracks[tk].subjects[sk]) tracks[tk].subjects[sk] = { teachers: new Set(), classes: new Set() }
      if (a.teacher) tracks[tk].subjects[sk].teachers.add(a.teacher.name_kh)
      tracks[tk].subjects[sk].classes.add(a.classroom?.name)
      tracks[tk].count++
    })
    return tracks
  })()

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'           },
        { label: 'គ្រប់គ្រង', path: '#'                                         },
        { label: 'ចាត់តាំងគ្រូបង្រៀន' },
      ]} />

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: 'assignment_ind', bg: 'bg-blue-600',   label: 'ការចាត់តាំងសរុប',   value: assignments.length },
          { icon: 'school',         bg: 'bg-gray-500',   label: 'ទូទៅ',               value: genCount           },
          { icon: 'science',        bg: 'bg-blue-500',   label: 'វិទ្យាសាស្ត្រពិត',   value: sciCount           },
          { icon: 'public',         bg: 'bg-purple-600', label: 'វិទ្យាសាស្ត្រសង្គម', value: socialCount        },
        ].map((s, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center
                            justify-center flex-shrink-0 shadow-sm`}>
              <span className="material-icons text-white text-xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Track Overview Panel */}
      <div className="card overflow-hidden">
        <div className="bg-slate-800 px-5 py-3">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <span className="material-icons text-blue-300 text-lg">account_tree</span>
            Track → Subject → Teacher → Class — Relationship Overview
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0
                        md:divide-x divide-gray-100">
          {[
            {
              key: 'general', label: 'Grade 10 — ទូទៅ',
              icon: 'school', color: 'bg-gray-600',
              lightBg: 'bg-gray-50', textColor: 'text-gray-700',
              desc: 'General Education Subjects',
              subjects: ['KH', 'EN', 'MATH', 'HIST', 'GEO'],
            },
            {
              key: 'science', label: 'Grade 11-12 — វិទ្យាសាស្ត្រពិត',
              icon: 'science', color: 'bg-blue-600',
              lightBg: 'bg-blue-50', textColor: 'text-blue-700',
              desc: 'Real Science Subjects',
              subjects: ['PHY', 'CHEM', 'BIO', 'AMATH'],
            },
            {
              key: 'social_science', label: 'Grade 11-12 — វិទ្យាសាស្ត្រសង្គម',
              icon: 'public', color: 'bg-purple-600',
              lightBg: 'bg-purple-50', textColor: 'text-purple-700',
              desc: 'Social Science Subjects',
              subjects: ['HIST2', 'GEO2', 'ECON', 'CIVIC2'],
            },
          ].map(track => {
            const viz = relViz[track.key] || { subjects: {}, count: 0 }
            return (
              <div key={track.key} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-9 h-9 ${track.color} rounded-xl flex items-center
                                  justify-center flex-shrink-0`}>
                    <span className="material-icons text-white text-base">{track.icon}</span>
                  </div>
                  <div>
                    <p className={`font-bold text-xs ${track.textColor}`}>{track.label}</p>
                    <p className="text-xs text-gray-400">{track.desc}</p>
                  </div>
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full
                    ${track.lightBg} ${track.textColor}`}>
                    {viz.count}
                  </span>
                </div>

                {/* Relationship: Subject → Teacher → Class */}
                <div className="space-y-1.5">
                  {track.subjects.slice(0, 4).map(code => {
                    const rel = viz.subjects[code]
                    return (
                      <div key={code}
                        className={`p-2 rounded-lg border ${track.lightBg}
                                   ${track.key === 'general'        ? 'border-gray-200'   :
                                     track.key === 'science'        ? 'border-blue-200'   :
                                     'border-purple-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-mono text-xs font-bold
                            ${track.key === 'general'        ? 'text-gray-600'   :
                              track.key === 'science'        ? 'text-blue-700'   :
                              'text-purple-700'}`}>
                            {code}
                          </span>
                          {rel ? (
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                <span className="material-icons text-xs">person</span>
                                {rel.teachers.size}
                              </span>
                              <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                <span className="material-icons text-xs">meeting_room</span>
                                {rel.classes.size}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-amber-500 flex items-center gap-0.5">
                              <span className="material-icons text-xs">warning_amber</span>
                              មិនទាន់
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">ការចាត់តាំងគ្រូបង្រៀន</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            ចាត់តាំងតាម Track → Subject → Teacher → Class
          </p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setError(''); setModalOpen(true) }}
          className="btn-primary">
          <span className="material-icons text-lg">add_circle</span>
          <span>ចាត់តាំងថ្មី</span>
        </button>
      </div>

      {/* Filters + Table */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                                text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                w-52 bg-white"
                placeholder="ស្វែងរក..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            {[
              { val: filterYear,     set: setFilterYear,     opts: years,    keyF: 'id', labelF: 'name',    ph: 'ឆ្នាំ' },
              { val: filterGrade,    set: setFilterGrade,    opts: grades,   keyF: 'id', labelF: 'name',    ph: 'ថ្នាក់ទី' },
              { val: filterSubject,  set: setFilterSubject,  opts: subjects, keyF: 'id', labelF: 'name_kh', ph: 'មុខវិជ្ជា' },
              { val: filterTeacher,  set: setFilterTeacher,  opts: teachers, keyF: 'id', labelF: 'name_kh', ph: 'គ្រូ' },
            ].map((f, i) => (
              <select key={i} value={f.val}
                onChange={e => { f.set(e.target.value); setPage(1) }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                <option value="">{f.ph}ទាំងអស់</option>
                {f.opts.map(o => (
                  <option key={o[f.keyF]} value={o[f.keyF]}>{o[f.labelF]}</option>
                ))}
              </select>
            ))}

            <select value={filterSemester}
              onChange={e => { setFilterSemester(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ឆមាសទាំងអស់</option>
              <option value="1">ឆមាសទី ១</option>
              <option value="2">ឆមាសទី ២</option>
            </select>
          </div>

          {/* Track Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { val: '',              label: 'ទាំងអស់'             },
              { val: 'general',       label: 'ទូទៅ'                },
              { val: 'science',       label: 'វិទ្យាសាស្ត្រពិត'    },
              { val: 'social_science',label: 'វិទ្យាសាស្ត្រសង្គម' },
            ].map(opt => (
              <button key={opt.val}
                onClick={() => { setFilterTrack(opt.val); setPage(1) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border
                            transition-all
                            ${filterTrack === opt.val
                              ? 'bg-blue-700 text-white border-blue-700'
                              : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}>
                {opt.label}
              </button>
            ))}
            <span className="ml-auto badge badge-blue">
              <span className="material-icons text-xs">assignment_ind</span>
              {filtered.length} ការចាត់តាំង
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">គ្រូបង្រៀន</th>
                <th className="table-th">មុខវិជ្ជា</th>
                <th className="table-th">ថ្នាក់ទី</th>
                <th className="table-th">Track</th>
                <th className="table-th">ថ្នាក់</th>
                <th className="table-th">ឆមាស</th>
                <th className="table-th">ឆ្នាំ</th>
                <th className="table-th text-center">ស្ថានភាព</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={10} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr><td colSpan={10} className="py-16 text-center">
                  <span className="material-icons text-5xl text-gray-200 block mb-3">
                    assignment_ind
                  </span>
                  <p className="text-gray-400 text-sm">
                    {search ? 'រកមិនឃើញ' : 'គ្មានការចាត់តាំង'}
                  </p>
                </td></tr>
              )}
              {paginated.map((a, i) => {
                const track = a.classroom?.track || ''
                const tCfg  = TRACK_CFG[track]   || TRACK_CFG['']
                const sTrack= getSubjectTrack(a.subject?.code || '')
                return (
                  <tr key={`${a.id}-${i}`} className="table-tr-hover">
                    <td className="table-td text-gray-400 text-xs">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                        flex-shrink-0 font-bold text-sm
                          ${a.teacher?.gender === 'female'
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-blue-100 text-blue-600'}`}>
                          {(a.teacher?.name_kh || '?').charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {a.teacher?.name_kh || '—'}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {a.teacher?.teacher_code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <p className="font-semibold text-gray-800 text-sm">
                        {a.subject?.name_kh || '—'}
                      </p>
                      <span className="font-mono text-xs bg-gray-100 text-gray-600
                                       px-1.5 py-0.5 rounded">
                        {a.subject?.code}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className="badge badge-blue text-xs">
                        {a.classroom?.grade?.name || '—'}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-5 rounded-full ${tCfg.bar}`} />
                        <span className={`badge ${tCfg.cls} text-xs`}>
                          <span className="material-icons text-xs">
                            {tCfg.icon || 'school'}
                          </span>
                          {tCfg.label}
                        </span>
                      </div>
                    </td>
                    <td className="table-td font-bold text-gray-800">
                      {a.classroom?.name || '—'}
                    </td>
                    <td className="table-td text-sm text-gray-600">
                      {SEMESTER_LABEL[a.semester] || '—'}
                    </td>
                    <td className="table-td text-sm text-gray-500">
                      {a.classroom?.academic_year?.name || '—'}
                    </td>
                    <td className="table-td text-center">
                      <span className="badge badge-green">
                        <span className="material-icons text-xs">check_circle</span>
                        សកម្ម
                      </span>
                    </td>
                    <td className="table-td text-center">
                      <button onClick={() => setDeleteTarget(a)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                   bg-red-50 hover:bg-red-100 text-red-500
                                   text-xs font-medium transition-colors mx-auto">
                        <span className="material-icons text-sm">person_remove</span>
                        លុប
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page} totalPages={totalPages} perPage={perPage}
          total={filtered.length} onPageChange={setPage}
          onPerPageChange={n => { setPerPage(n); setPage(1) }}
        />
      </div>

      {/* ══ Assignment Form Modal ══ */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title="ចាត់តាំងគ្រូបង្រៀន" icon="assignment_ind" size="lg">

        {/* Conflict Warning */}
        {conflicts.length > 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-300
                          rounded-xl px-4 py-3.5 mb-5">
            <span className="material-icons text-amber-500 text-2xl flex-shrink-0">warning</span>
            <div>
              <p className="font-bold text-amber-800 text-sm">
                Assignment Conflict Detected!
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                មុខវិជ្ជានេះត្រូវបានចាត់តាំងហើយក្នុងថ្នាក់នេះ:
              </p>
              {conflicts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 mt-1.5 bg-amber-100
                                        rounded-lg px-3 py-1.5">
                  <span className="material-icons text-amber-600 text-sm">
                    assignment_ind
                  </span>
                  <p className="text-xs text-amber-700 font-medium">
                    {c.teacher?.name_kh} →
                    {c.subject?.name_kh} →
                    {c.classroom?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-700 rounded-lg px-3 py-2.5 mb-4 text-sm">
            <span className="material-icons text-red-500 text-base">error_outline</span>
            {error}
          </div>
        )}

        {/* Assignment Flow Visual */}
        <div className="flex items-center gap-1 mb-5 p-3 bg-gray-50 rounded-xl
                        overflow-x-auto">
          {[
            { step: 1, label: 'ឆ្នាំ',    icon: 'event_note',   done: !!form.academic_year_id   },
            { step: 2, label: 'ឆមាស',    icon: 'event',         done: !!form.semester           },
            { step: 3, label: 'ថ្នាក់ទី', icon: 'school',        done: !!form.grade_id           },
            { step: 4, label: 'Track',    icon: 'account_tree',  done: !!form.track || selectedGradeLevel === '10' },
            { step: 5, label: 'ថ្នាក់',   icon: 'meeting_room',  done: !!form.classroom_id       },
            { step: 6, label: 'វិជ្ជា',   icon: 'menu_book',     done: !!form.subject_id         },
            { step: 7, label: 'គ្រូ',     icon: 'person',        done: !!form.teacher_profile_id },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-1 flex-shrink-0">
              <div className={`flex flex-col items-center`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                transition-all text-sm
                  ${s.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {s.done
                    ? <span className="material-icons text-sm">check</span>
                    : <span className="material-icons text-sm">{s.icon}</span>
                  }
                </div>
                <p className="text-xs mt-0.5 text-gray-500">{s.label}</p>
              </div>
              {i < 6 && (
                <span className={`material-icons text-sm mb-3 flex-shrink-0
                  ${s.done ? 'text-green-400' : 'text-gray-300'}`}>
                  chevron_right
                </span>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Step 1: Academic Year */}
            <div>
              <RequiredLabel>
                <span className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 bg-blue-700 text-white rounded text-xs
                                   flex items-center justify-center font-bold">១</span>
                  ឆ្នាំសិក្សា
                </span>
              </RequiredLabel>
              <select className="input-field"
                value={form.academic_year_id}
                onChange={e => setForm({ ...form, academic_year_id: e.target.value })}
                required>
                <option value="">-- ជ្រើស --</option>
                {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
              </select>
            </div>

            {/* Step 2: Semester */}
            <div>
              <RequiredLabel>
                <span className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 bg-blue-700 text-white rounded text-xs
                                   flex items-center justify-center font-bold">២</span>
                  ឆមាស
                </span>
              </RequiredLabel>
              <select className="input-field"
                value={form.semester}
                onChange={e => setForm({ ...form, semester: e.target.value })}>
                <option value="1">ឆមាសទី ១</option>
                <option value="2">ឆមាសទី ២</option>
              </select>
            </div>

            {/* Step 3: Grade */}
            <div>
              <RequiredLabel>
                <span className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 bg-blue-700 text-white rounded text-xs
                                   flex items-center justify-center font-bold">៣</span>
                  ថ្នាក់ទី
                </span>
              </RequiredLabel>
              <select className="input-field"
                value={form.grade_id}
                onChange={e => setForm({
                  ...form, grade_id: e.target.value,
                  track: '', classroom_id: '', subject_id: '', teacher_profile_id: ''
                })}
                required>
                <option value="">-- ជ្រើស --</option>
                {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            {/* Step 4: Track */}
            <div>
              <RequiredLabel>
                <span className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 bg-blue-700 text-white rounded text-xs
                                   flex items-center justify-center font-bold">៤</span>
                  Track / កម្មវិធី
                </span>
              </RequiredLabel>
              <select className="input-field"
                value={form.track}
                onChange={e => setForm({
                  ...form, track: e.target.value,
                  classroom_id: '', subject_id: '', teacher_profile_id: ''
                })}
                disabled={!form.grade_id || selectedGradeLevel === '10'}
                required={selectedGradeLevel === '11' || selectedGradeLevel === '12'}>
                {selectedGradeLevel === '10' || !selectedGradeLevel
                  ? <option value="">ទូទៅ (General Education)</option>
                  : <>
                      <option value="">-- ជ្រើស --</option>
                      <option value="science">វិទ្យាសាស្ត្រពិត (Real Science)</option>
                      <option value="social_science">វិទ្យាសាស្ត្រសង្គម (Social Science)</option>
                    </>
                }
              </select>
              {/* Track Subjects hint */}
              {form.track && (
                <div className={`mt-1.5 text-xs p-2 rounded-lg flex items-start gap-1.5
                  ${form.track === 'science'        ? 'bg-blue-50 text-blue-700'   :
                    form.track === 'social_science' ? 'bg-purple-50 text-purple-700': ''}`}>
                  <span className="material-icons text-sm flex-shrink-0">info</span>
                  <span>
                    {form.track === 'science'
                      ? 'មុខវិជ្ជា: រូបវិទ្យា · គីមី · ជីវវិទ្យា · គណិតជ្រៅ'
                      : 'មុខវិជ្ជា: ប្រវត្តិ · ភូមិ · សេដ្ឋកិច្ច · ពលរដ្ឋ'}
                  </span>
                </div>
              )}
            </div>

            {/* Step 5: Class */}
            <div>
              <RequiredLabel>
                <span className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 bg-blue-700 text-white rounded text-xs
                                   flex items-center justify-center font-bold">៥</span>
                  ថ្នាក់រៀន
                </span>
              </RequiredLabel>
              <select className="input-field"
                value={form.classroom_id}
                onChange={e => setForm({ ...form, classroom_id: e.target.value, subject_id: '' })}
                disabled={!form.grade_id}
                required>
                <option value="">-- ជ្រើស --</option>
                {filteredClassrooms.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.grade?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 6: Subject */}
            <div>
              <RequiredLabel>
                <span className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 bg-blue-700 text-white rounded text-xs
                                   flex items-center justify-center font-bold">៦</span>
                  មុខវិជ្ជា
                </span>
              </RequiredLabel>
              <select className="input-field"
                value={form.subject_id}
                onChange={e => setForm({ ...form, subject_id: e.target.value })}
                disabled={!form.classroom_id}
                required>
                <option value="">-- ជ្រើស --</option>
                {filteredSubjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name_kh} ({s.code})
                  </option>
                ))}
              </select>
              {form.grade_id && filteredSubjects.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <span className="material-icons text-sm">warning_amber</span>
                  គ្មានមុខវិជ្ជាសម្រាប់ Track/Grade នេះ
                </p>
              )}
            </div>

            {/* Step 7: Teacher */}
            <div className="md:col-span-2">
              <RequiredLabel>
                <span className="inline-flex items-center gap-1">
                  <span className="w-5 h-5 bg-blue-700 text-white rounded text-xs
                                   flex items-center justify-center font-bold">៧</span>
                  គ្រូបង្រៀន
                  {form.track && (
                    <span className={`text-xs font-normal ml-1
                      ${form.track === 'science' ? 'text-blue-600' : 'text-purple-600'}`}>
                      (ជ្រើសតែគ្រូ{form.track === 'science' ? 'វិទ្យាសាស្ត្រ' : 'សង្គម'})
                    </span>
                  )}
                </span>
              </RequiredLabel>
              <select className="input-field"
                value={form.teacher_profile_id}
                onChange={e => setForm({ ...form, teacher_profile_id: e.target.value })}
                required>
                <option value="">-- ជ្រើសគ្រូ --</option>
                {filteredTeachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name_kh} — {t.teacher_code}
                    {t.subject_expertise ? ` (${t.subject_expertise})` : ''}
                  </option>
                ))}
              </select>
              {form.track && filteredTeachers.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <span className="material-icons text-sm">warning_amber</span>
                  គ្មានគ្រូមានជំនាញ{form.track === 'science' ? 'វិទ្យាសាស្ត្រ' : 'សង្គម'}
                </p>
              )}
            </div>
          </div>

          {/* Assignment History Note */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5
                           flex items-center gap-1.5">
              <span className="material-icons text-sm">history</span>
              Assignment History
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="material-icons text-sm text-gray-400">person</span>
                <span>Created By: Admin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-icons text-sm text-gray-400">calendar_today</span>
                <span>Date: {new Date().toLocaleDateString('km-KH')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-icons text-sm text-gray-400">update</span>
                <span>Status: Pending Submit</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
            <button type="button" onClick={() => setModalOpen(false)}
              className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button type="submit"
              disabled={loading || conflicts.length > 0}
              className="btn-primary flex-1">
              {loading ? <><Spinner /><span>ចាត់តាំង...</span></> :
                <><span className="material-icons text-lg">assignment_ind</span>
                  <span>ចាត់តាំងគ្រូ</span></>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="លុបការចាត់តាំង" icon="person_remove" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <span className="material-icons text-red-500 text-3xl">person_remove</span>
          </div>
          <p className="font-bold text-gray-800 text-lg mb-1">លុបការចាត់តាំង?</p>
          {deleteTarget && (
            <div className="bg-gray-50 rounded-xl p-3 mb-5 text-sm text-left space-y-1">
              <p className="flex items-center gap-2 text-gray-700">
                <span className="material-icons text-purple-600 text-base">person</span>
                <strong>{deleteTarget.teacher?.name_kh}</strong>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <span className="material-icons text-blue-600 text-base">menu_book</span>
                {deleteTarget.subject?.name_kh}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <span className="material-icons text-green-600 text-base">meeting_room</span>
                {deleteTarget.classroom?.name}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span><span>បោះបង់</span>
            </button>
            <button onClick={() => handleRemove(deleteTarget)}
              disabled={deleting} className="btn-danger flex-1">
              {deleting ? <><Spinner /><span>លុប...</span></> :
                <><span className="material-icons text-lg">delete_forever</span>
                  <span>បញ្ជាក់</span></>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}