import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import Breadcrumb    from '../../components/common/Breadcrumb'
import Pagination    from '../../components/common/Pagination'
import Modal         from '../../components/common/Modal'
import RequiredLabel from '../../components/common/RequiredLabel'

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

const EMPTY_FORM = {
  academic_year_id: '', grade_id: '', name: '',
  track: '', room: '', max_students: 45,
}

const TRACK_BADGE = {
  null:           { label: 'ទូទៅ',             icon: 'school',  cls: 'badge-gray',   bar: 'bg-gray-500'   },
  '':             { label: 'ទូទៅ',             icon: 'school',  cls: 'badge-gray',   bar: 'bg-gray-500'   },
  science:        { label: 'វិទ្យាសាស្ត្រពិត', icon: 'science', cls: 'badge-green',  bar: 'bg-green-500'  },
  social_science: { label: 'វិទ្យាសាស្ត្រសង្គម',icon: 'public',  cls: 'badge-purple', bar: 'bg-purple-500' },
}

function TrackBadge({ track }) {
  const cfg = TRACK_BADGE[track] || TRACK_BADGE['']
  return (
    <span className={`badge ${cfg.cls}`}>
      <span className="material-icons text-xs">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

const GRADE_TRACK_INFO = {
  '10': { tracks: [{ val: '', label: 'ទូទៅ (General)', icon: 'school',  desc: 'ថ្នាក់ទី១០ ប្រើកម្មវិធីទូទៅ' }] },
  '11': { tracks: [
    { val: 'science',        label: 'វិទ្យាសាស្ត្រពិត (Real Science)',    icon: 'science', desc: 'រូបវិទ្យា គីមី ជីវវិទ្យា' },
    { val: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម (Social Science)', icon: 'public',  desc: 'សេដ្ឋកិច្ច ហិរញ្ញវត្ថុ ភូមិ' },
  ]},
  '12': { tracks: [
    { val: 'science',        label: 'វិទ្យាសាស្ត្រពិត (Real Science)',    icon: 'science', desc: 'រូបវិទ្យា គីមី ជីវវិទ្យា' },
    { val: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម (Social Science)', icon: 'public',  desc: 'សេដ្ឋកិច្ច ហិរញ្ញវត្ថុ ភូមិ' },
  ]},
}

export default function ClassroomPage() {
  const [classrooms, setClassrooms] = useState([])
  const [years,      setYears]      = useState([])
  const [grades,     setGrades]     = useState([])
  const [teachers,   setTeachers]   = useState([])
  const [fetching,   setFetching]   = useState(true)

  // Filters
  const [filterYear,  setFilterYear]  = useState('')
  const [filterGrade, setFilterGrade] = useState('')
  const [filterTrack, setFilterTrack] = useState('')
  const [search,      setSearch]      = useState('')

  // Pagination
  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const fetchAll = async () => {
    setFetching(true)
    try {
      const [cr, yr, gr, tr] = await Promise.all([
        api.get('/admin/classrooms'),
        api.get('/admin/academic-years'),
        api.get('/admin/grades'),
        api.get('/admin/teachers'),
      ])
      setClassrooms(cr.data)
      setYears(yr.data)
      setGrades(gr.data)
      setTeachers(tr.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchAll() }, [])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const selectedGrade = grades.find(g => g.id == form.grade_id)
  const selectedLevel = selectedGrade?.level
  const trackChoices  = GRADE_TRACK_INFO[selectedLevel]?.tracks || []

  useEffect(() => {
    if (selectedLevel === '10') {
      setForm(f => ({ ...f, track: '' }))
    }
  }, [selectedLevel])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      academic_year_id: c.academic_year_id,
      grade_id:         c.grade_id,
      name:             c.name,
      track:            c.track || '',
      room:             c.room  || '',
      max_students:     c.max_students,
    })
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, track: form.track || null, max_students: Number(form.max_students) }
      if (editing) {
        await api.put(`/admin/classrooms/${editing.id}`, payload)
        showSuccess('កែប្រែថ្នាក់ជោគជ័យ!')
      } else {
        await api.post('/admin/classrooms', payload)
        showSuccess('បង្កើតថ្នាក់ថ្មីជោគជ័យ!')
      }
      await fetchAll()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await api.delete(`/admin/classrooms/${id}`)
      showSuccess('លុបថ្នាក់ជោគជ័យ!')
      setDeleteTarget(null)
      fetchAll()
    } catch (_) {}
    setDeleting(false)
  }

  const handleExport = () => {
    const headers = ['ថ្នាក់', 'ថ្នាក់ទី', 'Track', 'បន្ទប់', 'ឆ្នាំ', 'អតិបរមា']
    const rows = filtered.map(c => [
      c.name,
      c.grade?.name || '',
      TRACK_BADGE[c.track]?.label || 'ទូទៅ',
      c.room || '',
      c.academic_year?.name || '',
      c.max_students,
    ])
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'classrooms.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // Filters
  const filtered = classrooms.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.grade?.name || '').includes(search) ||
      (c.room || '').toLowerCase().includes(search.toLowerCase())
    const matchYear  = !filterYear  || c.academic_year_id?.toString() === filterYear
    const matchGrade = !filterGrade || c.grade_id?.toString() === filterGrade
    const matchTrack = !filterTrack ||
      (filterTrack === '__general__' ? !c.track : c.track === filterTrack)
    return matchSearch && matchYear && matchGrade && matchTrack
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  // Stats
  const sciTotal    = classrooms.filter(c => c.track === 'science').length
  const socialTotal = classrooms.filter(c => c.track === 'social_science').length
  const genTotal    = classrooms.filter(c => !c.track).length

  // Grade breakdown
  const grade10 = classrooms.filter(c => c.grade?.level === '10').length
  const grade11 = classrooms.filter(c => c.grade?.level === '11').length
  const grade12 = classrooms.filter(c => c.grade?.level === '12').length

  return (
    <div className="space-y-4">

      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'    },
        { label: 'គ្រប់គ្រង', path: '#'                                  },
        { label: 'ថ្នាក់រៀន' },
      ]} />

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* ── Track System Overview ── */}
      <div className="card overflow-hidden">
        <div className="bg-slate-800 px-5 py-3">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <span className="material-icons text-blue-300 text-lg">account_tree</span>
            ប្រព័ន្ធ Track — Cambodia High School Track System
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x
                        divide-gray-100">
          {/* Grade 10 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="material-icons text-gray-600 text-base">school</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">ថ្នាក់ទី ១០</p>
                <p className="text-xs text-gray-400">General Education</p>
              </div>
              <span className="badge badge-gray ml-auto">{grade10} ថ្នាក់</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
              <span className="material-icons text-gray-500 text-sm">school</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">ទូទៅ (General)</p>
                <p className="text-xs text-gray-400">មុខវិជ្ជាទូទៅ ១០ ±</p>
              </div>
            </div>
          </div>

          {/* Grade 11 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="material-icons text-blue-600 text-base">science</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">ថ្នាក់ទី ១១</p>
                <p className="text-xs text-gray-400">Track System Begins</p>
              </div>
              <span className="badge badge-blue ml-auto">{grade11} ថ្នាក់</span>
            </div>
            <div className="space-y-1.5">
              {[
                { track: 'science',        label: 'វិទ្យាសាស្ត្រពិត',  icon: 'science', cls: 'bg-blue-50', tc: 'text-blue-700',
                  count: classrooms.filter(c => c.grade?.level === '11' && c.track === 'science').length },
                { track: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម', icon: 'public',  cls: 'bg-purple-50', tc: 'text-purple-700',
                  count: classrooms.filter(c => c.grade?.level === '11' && c.track === 'social_science').length },
              ].map(t => (
                <div key={t.track} className={`flex items-center gap-2 p-2 ${t.cls} rounded-lg`}>
                  <span className={`material-icons text-sm ${t.tc}`}>{t.icon}</span>
                  <p className={`text-xs font-semibold ${t.tc} flex-1`}>{t.label}</p>
                  <span className={`text-xs font-bold ${t.tc}`}>{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grade 12 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="material-icons text-green-600 text-base">workspace_premium</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">ថ្នាក់ទី ១២</p>
                <p className="text-xs text-gray-400">Final Year</p>
              </div>
              <span className="badge badge-green ml-auto">{grade12} ថ្នាក់</span>
            </div>
            <div className="space-y-1.5">
              {[
                { track: 'science',        label: 'វិទ្យាសាស្ត្រពិត',  icon: 'science', cls: 'bg-green-50',  tc: 'text-green-700',
                  count: classrooms.filter(c => c.grade?.level === '12' && c.track === 'science').length },
                { track: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម', icon: 'public',  cls: 'bg-orange-50', tc: 'text-orange-700',
                  count: classrooms.filter(c => c.grade?.level === '12' && c.track === 'social_science').length },
              ].map(t => (
                <div key={t.track} className={`flex items-center gap-2 p-2 ${t.cls} rounded-lg`}>
                  <span className={`material-icons text-sm ${t.tc}`}>{t.icon}</span>
                  <p className={`text-xs font-semibold ${t.tc} flex-1`}>{t.label}</p>
                  <span className={`text-xs font-bold ${t.tc}`}>{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: 'meeting_room', iconBg: 'bg-blue-600',   label: 'ថ្នាក់សរុប',          value: classrooms.length },
          { icon: 'school',       iconBg: 'bg-gray-500',   label: 'ថ្នាក់ទូទៅ (ទី១០)',   value: genTotal          },
          { icon: 'science',      iconBg: 'bg-green-600',  label: 'វិទ្យាសាស្ត្រពិត',    value: sciTotal          },
          { icon: 'public',       iconBg: 'bg-purple-600', label: 'វិទ្យាសាស្ត្រសង្គម',  value: socialTotal       },
        ].map((s, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center
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

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងថ្នាក់រៀន</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            ១០A · ១០B · ១១A (វិទ្យាសាស្ត្រ) · ១១B (សង្គម) · ១២A · ១២B
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-200
                       bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium">
            <span className="material-icons text-base">download</span>
            Export CSV
          </button>
          <button onClick={openCreate} className="btn-primary">
            <span className="material-icons text-lg">add_circle</span>
            <span>បង្កើតថ្នាក់</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="card">

        {/* Filters Bar */}
        <div className="px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                                text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                w-52 bg-white"
                placeholder="ស្វែងរកថ្នាក់..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>

            {/* Year */}
            <select value={filterYear}
              onChange={e => { setFilterYear(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ឆ្នាំទាំងអស់</option>
              {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>

            {/* Grade */}
            <select value={filterGrade}
              onChange={e => { setFilterGrade(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ថ្នាក់ទីទាំងអស់</option>
              {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            {/* Track Filter Buttons */}
            <div className="flex items-center gap-1.5">
              {[
                { val: '',             label: 'ទាំងអស់'             },
                { val: '__general__',  label: 'ទូទៅ'               },
                { val: 'science',      label: 'វិទ្យាសាស្ត្រពិត'    },
                { val: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម' },
              ].map(opt => (
                <button key={opt.val}
                  onClick={() => { setFilterTrack(opt.val); setPage(1) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                              border transition-all
                              ${filterTrack === opt.val
                                ? 'bg-blue-700 text-white border-blue-700'
                                : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <span className="badge badge-blue ml-auto">
              <span className="material-icons text-xs">meeting_room</span>
              {filtered.length} ថ្នាក់
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">ឈ្មោះថ្នាក់</th>
                <th className="table-th">ថ្នាក់ទី</th>
                <th className="table-th">Track / កម្មវិធី</th>
                <th className="table-th">Homeroom Teacher</th>
                <th className="table-th">ឆ្នាំ / ឆមាស</th>
                <th className="table-th">ទីតាំង</th>
                <th className="table-th text-center">អតិបរមា</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={9} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr><td colSpan={9} className="py-16 text-center">
                  <span className="material-icons text-5xl text-gray-200 block mb-3">
                    meeting_room
                  </span>
                  <p className="text-gray-400 text-sm">
                    {search || filterYear || filterGrade || filterTrack
                      ? 'រកមិនឃើញ' : 'គ្មានថ្នាក់រៀន'}
                  </p>
                </td></tr>
              )}
              {paginated.map((c, i) => {
                const trackCfg = TRACK_BADGE[c.track] || TRACK_BADGE['']
                const homeroom = c.homeroom_teacher?.teacher_profile
                return (
                  <tr key={c.id} className="table-tr-hover">
                    <td className="table-td text-gray-400 text-xs">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center
                                        justify-center flex-shrink-0 font-bold text-sm
                          ${c.track === 'science'        ? 'bg-blue-700 text-white'   :
                            c.track === 'social_science' ? 'bg-purple-700 text-white' :
                            'bg-gray-700 text-white'}`}>
                          {c.name}
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="badge badge-blue">{c.grade?.name}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-6 rounded-full ${trackCfg.bar}`} />
                        <TrackBadge track={c.track} />
                      </div>
                    </td>
                    <td className="table-td">
                      {homeroom ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center
                                          justify-center flex-shrink-0">
                            <span className="material-icons text-blue-600 text-sm">person</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {homeroom.name_kh}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              {homeroom.teacher_code}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600
                                         bg-amber-50 border border-amber-200 rounded-lg
                                         px-2 py-1 w-fit">
                          <span className="material-icons text-sm">warning_amber</span>
                          មិនទាន់ចាត់
                        </span>
                      )}
                    </td>
                    <td className="table-td">
                      <p className="text-sm text-gray-700">{c.academic_year?.name}</p>
                      <div className="flex gap-1 mt-0.5">
                        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          ឆមាស ១+២
                        </span>
                      </div>
                    </td>
                    <td className="table-td">
                      {c.room ? (
                        <div className="flex items-center gap-1 text-gray-600 text-sm">
                          <span className="material-icons text-gray-400 text-base">
                            location_on
                          </span>
                          {c.room}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="table-td text-center">
                      <span className="font-mono font-semibold text-sm text-gray-700">
                        {c.max_students}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(c)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600
                                     text-xs font-medium transition-colors">
                          <span className="material-icons text-sm">edit</span>
                          កែ
                        </button>
                        <button onClick={() => setDeleteTarget(c)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                     bg-red-50 hover:bg-red-100 text-red-500
                                     text-xs font-medium transition-colors">
                          <span className="material-icons text-sm">delete_outline</span>
                          លុប
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          perPage={perPage}
          total={filtered.length}
          onPageChange={setPage}
          onPerPageChange={(n) => { setPerPage(n); setPage(1) }}
        />
      </div>

      {/* ══ Create/Edit Modal ══ */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'កែប្រែថ្នាក់រៀន' : 'បង្កើតថ្នាក់រៀន'}
        icon={editing ? 'edit' : 'add_circle'}
        size="lg">

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-700 rounded-lg px-3 py-2.5 mb-5 text-sm">
            <span className="material-icons text-red-500 text-base">error_outline</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <RequiredLabel>ឆ្នាំសិក្សា</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">event_note</span>
                <select className="input-field pl-10"
                  value={form.academic_year_id}
                  onChange={e => setForm({ ...form, academic_year_id: e.target.value })}
                  required>
                  <option value="">-- ជ្រើសឆ្នាំ --</option>
                  {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <RequiredLabel>ថ្នាក់ទី</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">school</span>
                <select className="input-field pl-10"
                  value={form.grade_id}
                  onChange={e => setForm({ ...form, grade_id: e.target.value, track: '' })}
                  required>
                  <option value="">-- ជ្រើសថ្នាក់ --</option>
                  {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>

            {/* Track Selection — Cambodia Track System */}
            <div className="md:col-span-2">
              <RequiredLabel>
                Track / កម្មវិធីសិក្សា
                {!form.grade_id && (
                  <span className="text-gray-400 font-normal ml-1 text-xs">
                    (ជ្រើសថ្នាក់ទីជាមុន)
                  </span>
                )}
              </RequiredLabel>

              {!form.grade_id ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6
                                text-center text-gray-400">
                  <span className="material-icons text-3xl block mb-2 text-gray-300">
                    account_tree
                  </span>
                  <p className="text-sm">សូមជ្រើសថ្នាក់ទីជាមុន</p>
                </div>
              ) : (
                <div className={`grid gap-3 ${trackChoices.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {trackChoices.map(opt => {
                    const isSelected = form.track === opt.val
                    const colors = {
                      school:  { ring: 'border-gray-500 bg-gray-50',   text: 'text-gray-700',   icon: 'text-gray-500'   },
                      science: { ring: 'border-blue-500 bg-blue-50',   text: 'text-blue-700',   icon: 'text-blue-600'   },
                      public:  { ring: 'border-purple-500 bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
                    }
                    const c = colors[opt.icon] || colors.school
                    return (
                      <label key={opt.val}
                        className={`flex items-start gap-3 border-2 rounded-xl px-4 py-3.5
                                    cursor-pointer transition-all
                                    ${isSelected ? c.ring : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" className="sr-only"
                          value={opt.val}
                          checked={form.track === opt.val}
                          onChange={() => setForm({ ...form, track: opt.val })}
                          disabled={selectedLevel === '10'} />
                        <span className={`material-icons text-2xl mt-0.5 flex-shrink-0
                          ${isSelected ? c.icon : 'text-gray-300'}`}>
                          {opt.icon}
                        </span>
                        <div className="flex-1">
                          <p className={`font-bold text-sm
                            ${isSelected ? c.text : 'text-gray-500'}`}>
                            {opt.label}
                          </p>
                          <p className={`text-xs mt-0.5
                            ${isSelected ? c.text : 'text-gray-400'}`}>
                            {opt.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="material-icons text-green-500 text-lg flex-shrink-0">
                            check_circle
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <RequiredLabel>ឈ្មោះថ្នាក់</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">meeting_room</span>
                <input className="input-field pl-10 font-bold"
                  placeholder="ឧ: 10A, 11A, 12B"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required />
              </div>
            </div>

            <div>
              <RequiredLabel optional>ទីតាំង / បន្ទប់</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">location_on</span>
                <input className="input-field pl-10"
                  placeholder="ឧ: អគារ A បន្ទប់ 101"
                  value={form.room}
                  onChange={e => setForm({ ...form, room: e.target.value })} />
              </div>
            </div>

            <div className="md:col-span-2">
              <RequiredLabel>ចំនួនសិស្សអតិបរមា</RequiredLabel>
              <div className="flex items-center gap-4">
                <div className="relative max-w-xs flex-1">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">groups</span>
                  <input type="number" className="input-field pl-10"
                    min={1} max={60}
                    value={form.max_students}
                    onChange={e => setForm({ ...form, max_students: Number(e.target.value) })} />
                </div>
                <div className="flex gap-2">
                  {[30, 40, 45, 50].map(n => (
                    <button key={n} type="button"
                      onClick={() => setForm({ ...form, max_students: n })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border
                                  transition-colors
                                  ${form.max_students === n
                                    ? 'bg-blue-700 text-white border-blue-700'
                                    : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Preview */}
          {form.name && form.grade_id && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">
                ព័ត៌មានសង្ខេប
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-blue text-sm px-3 py-1.5 font-bold">
                  <span className="material-icons text-sm">meeting_room</span>
                  {form.name}
                </span>
                {selectedGrade && (
                  <span className="badge badge-blue">{selectedGrade.name}</span>
                )}
                <TrackBadge track={form.track || null} />
                {form.room && (
                  <span className="badge badge-gray">
                    <span className="material-icons text-xs">location_on</span>
                    {form.room}
                  </span>
                )}
                <span className="badge badge-gray">
                  <span className="material-icons text-xs">groups</span>
                  {form.max_students} នាក់
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading
                ? <><Spinner /><span>កំពុងរក្សាទុក...</span></>
                : <><span className="material-icons text-lg">save</span>
                   <span>{editing ? 'រក្សាទុក' : 'បង្កើតថ្នាក់'}</span></>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="បញ្ជាក់ការលុប"
        icon="warning_amber"
        size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <span className="material-icons text-red-500 text-3xl">delete_forever</span>
          </div>
          <p className="font-bold text-gray-800 text-lg mb-2">
            លុបថ្នាក់ "{deleteTarget?.name}"?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            ទិន្នន័យវត្តមាន ពិន្ទុ និងចំណុះ
            ទាំងអស់នឹងត្រូវលុបចោល
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span><span>បោះបង់</span>
            </button>
            <button onClick={() => handleDelete(deleteTarget?.id)}
              disabled={deleting} className="btn-danger flex-1">
              {deleting
                ? <><Spinner /><span>លុប...</span></>
                : <><span className="material-icons text-lg">delete_forever</span>
                   <span>បញ្ជាក់</span></>
              }
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}