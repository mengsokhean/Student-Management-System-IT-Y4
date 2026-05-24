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
  academic_year_id: '',
  grade_id:         '',
  name:             '',
  track:            '',
  room:             '',
  max_students:     45,
}

const TRACK_OPTIONS = [
  { value: '',               label: 'ទូទៅ (ថ្នាក់ទី១០)',    icon: 'school',  color: 'gray'   },
  { value: 'science',        label: 'វិទ្យាសាស្ត្រពិត',    icon: 'science', color: 'green'  },
  { value: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម', icon: 'public',  color: 'purple' },
]

const trackBadge = (track) => {
  if (track === 'science')
    return <span className="badge badge-green"><span className="material-icons text-xs">science</span>វិទ្យាសាស្ត្រពិត</span>
  if (track === 'social_science')
    return <span className="badge badge-purple"><span className="material-icons text-xs">public</span>វិទ្យាសាស្ត្រសង្គម</span>
  return <span className="badge badge-gray"><span className="material-icons text-xs">school</span>ទូទៅ</span>
}

export default function ClassroomPage() {
  const [classrooms, setClassrooms] = useState([])
  const [years,      setYears]      = useState([])
  const [grades,     setGrades]     = useState([])
  const [fetching,   setFetching]   = useState(true)

  // Filters
  const [search,     setSearch]     = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterTrack, setFilterTrack] = useState('')

  // Pagination
  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]       = useState(EMPTY_FORM)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const fetchAll = async () => {
    setFetching(true)
    try {
      const [cr, yr, gr] = await Promise.all([
        api.get('/admin/classrooms'),
        api.get('/admin/academic-years'),
        api.get('/admin/grades'),
      ])
      setClassrooms(cr.data)
      setYears(yr.data)
      setGrades(gr.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchAll() }, [])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const selectedLevel = grades.find(g => g.id == form.grade_id)?.level

  // Auto-reset track when grade 10 selected
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
      room:             c.room || '',
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
      const payload = {
        ...form,
        track:        form.track || null,
        max_students: Number(form.max_students),
      }
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

  const handleExportCSV = () => {
    const headers = ['ឈ្មោះថ្នាក់', 'ថ្នាក់ទី', 'កម្មវិធី', 'បន្ទប់', 'ឆ្នាំ', 'អតិបរមា']
    const rows = filtered.map(c => [
      c.name,
      c.grade?.name || '',
      c.track === 'science' ? 'វិទ្យាសាស្ត្រពិត'
        : c.track === 'social_science' ? 'វិទ្យាសាស្ត្រសង្គម' : 'ទូទៅ',
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

  // Filter
  const filtered = classrooms.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.grade?.name || '').includes(search) ||
      (c.room || '').toLowerCase().includes(search.toLowerCase())
    const matchYear  = !filterYear  || c.academic_year_id?.toString() === filterYear
    const matchTrack = !filterTrack ||
      (filterTrack === 'none' ? !c.track : c.track === filterTrack)
    return matchSearch && matchYear && matchTrack
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  // Stats
  const sciCount    = classrooms.filter(c => c.track === 'science').length
  const socialCount = classrooms.filter(c => c.track === 'social_science').length
  const genCount    = classrooms.filter(c => !c.track).length

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'    },
        { label: 'គ្រប់គ្រង', path: '#'                                  },
        { label: 'បញ្ជីថ្នាក់រៀន' },
      ]} />

      {/* Success Toast */}
      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'ថ្នាក់ទាំងអស់',     val: classrooms.length, icon: 'meeting_room', bg: 'bg-blue-500'   },
          { label: 'ទូទៅ (ទី១០)',        val: genCount,           icon: 'school',       bg: 'bg-gray-500'   },
          { label: 'វិទ្យាសាស្ត្រពិត',  val: sciCount,           icon: 'science',      bg: 'bg-green-500'  },
          { label: 'វិទ្យាសាស្ត្រសង្គម', val: socialCount,       icon: 'public',       bg: 'bg-purple-500' },
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

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងថ្នាក់រៀន</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បង្កើត កែប្រែ ឬ លុប ថ្នាក់រៀន + Track System
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-200
                       bg-green-50 text-green-700 hover:bg-green-100 text-sm
                       font-medium transition-colors">
            <span className="material-icons text-base">download</span>
            Export CSV
          </button>
          <button onClick={openCreate} className="btn-primary">
            <span className="material-icons text-lg">add_circle</span>
            <span>បង្កើតថ្នាក់ថ្មី</span>
          </button>
        </div>
      </div>

      {/* ── Main Table Card ── */}
      <div className="card">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100
                        flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                                text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                w-56 bg-white"
                placeholder="ស្វែងរកថ្នាក់..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>

            {/* Year Filter */}
            <select
              value={filterYear}
              onChange={e => { setFilterYear(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ឆ្នាំសិក្សាទាំងអស់</option>
              {years.map(y => (
                <option key={y.id} value={y.id}>{y.name}</option>
              ))}
            </select>

            {/* Track Filter */}
            <select
              value={filterTrack}
              onChange={e => { setFilterTrack(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">Track ទាំងអស់</option>
              <option value="none">ទូទៅ</option>
              <option value="science">វិទ្យាសាស្ត្រពិត</option>
              <option value="social_science">វិទ្យាសាស្ត្រសង្គម</option>
            </select>
          </div>

          <span className="badge badge-blue">
            <span className="material-icons text-xs">meeting_room</span>
            {filtered.length} ថ្នាក់
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">ថ្នាក់</th>
                <th className="table-th">ថ្នាក់ទី</th>
                <th className="table-th">កម្មវិធីសិក្សា</th>
                <th className="table-th">ទីតាំង/បន្ទប់</th>
                <th className="table-th">ឆ្នាំសិក្សា</th>
                <th className="table-th text-center">អតិបរមា</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <span className="material-icons text-5xl text-gray-200 block mb-3">
                      meeting_room
                    </span>
                    <p className="text-gray-400 text-sm">
                      {search || filterYear || filterTrack ? 'រកមិនឃើញ' : 'គ្មានថ្នាក់រៀន'}
                    </p>
                  </td>
                </tr>
              )}
              {paginated.map((c, i) => (
                <tr key={c.id} className="table-tr-hover">
                  <td className="table-td text-gray-400 text-xs">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center
                                      justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{c.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="badge badge-blue">{c.grade?.name}</span>
                  </td>
                  <td className="table-td">{trackBadge(c.track)}</td>
                  <td className="table-td">
                    {c.room ? (
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <span className="material-icons text-gray-400 text-base">
                          location_on
                        </span>
                        {c.room}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="table-td text-gray-500 text-sm">
                    {c.academic_year?.name}
                  </td>
                  <td className="table-td text-center">
                    <span className="text-sm font-mono font-semibold text-gray-700">
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
        title={editing ? 'កែប្រែថ្នាក់រៀន' : 'បង្កើតថ្នាក់រៀនថ្មី'}
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

            {/* Academic Year */}
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
                  {years.map(y => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grade */}
            <div>
              <RequiredLabel>ថ្នាក់ទី</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">school</span>
                <select className="input-field pl-10"
                  value={form.grade_id}
                  onChange={e => setForm({ ...form, grade_id: e.target.value, track: '' })}
                  required>
                  <option value="">-- ជ្រើស --</option>
                  {grades.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Track — Full Width */}
            <div className="md:col-span-2">
              <RequiredLabel>
                កម្មវិធីសិក្សា (Track)
                {selectedLevel === '10' && (
                  <span className="text-gray-400 font-normal ml-1 text-xs">
                    — ថ្នាក់ទី១០ ប្រើទូទៅ
                  </span>
                )}
              </RequiredLabel>

              <div className={`grid gap-3 ${
                selectedLevel === '10' || !selectedLevel
                  ? 'grid-cols-1'
                  : 'grid-cols-3'}`}>
                {(selectedLevel === '10' || !selectedLevel
                  ? [TRACK_OPTIONS[0]]
                  : TRACK_OPTIONS.slice(1)
                ).map(opt => {
                  const colors = {
                    gray:   { border: 'border-gray-400 bg-gray-50',   text: 'text-gray-700',   icon: 'text-gray-500'   },
                    green:  { border: 'border-green-500 bg-green-50',  text: 'text-green-700',  icon: 'text-green-500'  },
                    purple: { border: 'border-purple-500 bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
                  }
                  const isSelected = form.track === opt.value
                  const c = colors[opt.color]
                  return (
                    <label key={opt.value}
                      className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3
                                  cursor-pointer transition-all
                                  ${isSelected
                                    ? c.border
                                    : 'border-gray-200 hover:border-gray-300'}
                                  ${selectedLevel === '10' || !selectedLevel
                                    ? 'cursor-default opacity-75' : ''}`}>
                      <input type="radio" className="sr-only"
                        value={opt.value}
                        checked={form.track === opt.value}
                        onChange={() => {
                          if (selectedLevel !== '10') {
                            setForm({ ...form, track: opt.value })
                          }
                        }}
                        disabled={selectedLevel === '10' || !selectedLevel} />
                      <span className={`material-icons text-2xl
                        ${isSelected ? c.icon : 'text-gray-300'}`}>
                        {opt.icon}
                      </span>
                      <span className={`font-semibold text-sm
                        ${isSelected ? c.text : 'text-gray-500'}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="material-icons text-base ml-auto text-green-500">
                          check_circle
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>

              {(selectedLevel === '11' || selectedLevel === '12') && !form.track && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <span className="material-icons text-sm">warning_amber</span>
                  សូមជ្រើសរើសកម្មវិធីសិក្សា
                </p>
              )}
            </div>

            {/* Class Name */}
            <div>
              <RequiredLabel>ឈ្មោះថ្នាក់</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  meeting_room
                </span>
                <input className="input-field pl-10 font-bold text-lg"
                  placeholder="ឧ: 12A, 11B, 10C"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required />
              </div>
            </div>

            {/* Room / Building — NEW FIELD */}
            <div>
              <RequiredLabel optional>ទីតាំង / បន្ទប់</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  location_on
                </span>
                <input className="input-field pl-10"
                  placeholder="ឧ: អគារ A បន្ទប់ 101"
                  value={form.room}
                  onChange={e => setForm({ ...form, room: e.target.value })} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ទីតាំងបន្ទប់រៀន ឬ អគាររៀន
              </p>
            </div>

            {/* Max Students */}
            <div className="md:col-span-2">
              <RequiredLabel>ចំនួនសិស្សអតិបរមា</RequiredLabel>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">groups</span>
                  <input type="number" className="input-field pl-10"
                    min={1} max={60}
                    value={form.max_students}
                    onChange={e => setForm({ ...form, max_students: Number(e.target.value) })} />
                </div>
                {/* Quick select */}
                <div className="flex gap-2">
                  {[30, 40, 45, 50].map(n => (
                    <button key={n} type="button"
                      onClick={() => setForm({ ...form, max_students: n })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium
                                  border transition-colors
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
            <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">
                ព័ត៌មានសង្ខេប
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="badge badge-blue text-sm px-3 py-1.5">
                  <span className="material-icons text-sm">meeting_room</span>
                  {form.name}
                </span>
                {grades.find(g => g.id == form.grade_id) && (
                  <span className="badge badge-blue">
                    {grades.find(g => g.id == form.grade_id)?.name}
                  </span>
                )}
                {trackBadge(form.track || null)}
                {form.room && (
                  <span className="badge badge-gray">
                    <span className="material-icons text-xs">location_on</span>
                    {form.room}
                  </span>
                )}
                <span className="badge badge-gray">
                  <span className="material-icons text-xs">groups</span>
                  អតិបរមា {form.max_students} នាក់
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="btn-secondary">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading
                ? <><Spinner /><span>កំពុងរក្សាទុក...</span></>
                : <>
                    <span className="material-icons text-lg">save</span>
                    <span>{editing ? 'រក្សាទុក' : 'បង្កើតថ្នាក់'}</span>
                  </>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* ══ Delete Confirm ══ */}
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
            ទិន្នន័យវត្តមាន ពិន្ទុ និងចំណុះទាំងអស់
            ក្នុងថ្នាក់នេះនឹងត្រូវលុបចោលផងដែរ។
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)}
              className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button onClick={() => handleDelete(deleteTarget?.id)}
              disabled={deleting}
              className="btn-danger flex-1">
              {deleting
                ? <><Spinner /><span>លុបកំពុង...</span></>
                : <><span className="material-icons text-lg">delete_forever</span>
                   <span>បញ្ជាក់លុប</span></>
              }
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}