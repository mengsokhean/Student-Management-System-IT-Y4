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
  student_code: '', name_kh: '', name_en: '',
  date_of_birth: '', gender: 'male',
  guardian_name: '', guardian_phone: '',
  phone: '', address: '', email: '', password: '',
}

const STATUS_CONFIG = {
  active:      { label: 'សកម្ម',    cls: 'badge-green',  icon: 'check_circle'        },
  transferred: { label: 'ផ្ទេរ',     cls: 'badge-yellow', icon: 'swap_horiz'          },
  dropped:     { label: 'ឈប់រៀន',   cls: 'badge-red',    icon: 'person_off'          },
  graduated:   { label: 'បញ្ចប់',    cls: 'badge-blue',   icon: 'school'              },
}

export default function EnrollmentPage() {
  const [classrooms,  setClassrooms]  = useState([])
  const [students,    setStudents]    = useState([])
  const [selected,    setSelected]    = useState('')
  const [fetching,    setFetching]    = useState(false)

  // Pagination
  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Search
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('active')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [form,      setForm]      = useState(EMPTY_FORM)

  // Status modal
  const [statusTarget, setStatusTarget] = useState(null)
  const [newStatus,    setNewStatus]    = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    api.get('/admin/classrooms').then(r => setClassrooms(r.data))
  }, [])

  const fetchStudents = async (id) => {
    if (!id) { setStudents([]); return }
    setFetching(true)
    try {
      const res = await api.get(`/admin/classrooms/${id}/students`)
      setStudents(res.data)
    } catch (_) {}
    setFetching(false)
  }

  const handleClassroom = (id) => {
    setSelected(id)
    setPage(1)
    setSearch('')
    fetchStudents(id)
  }

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const openModal = () => {
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected) { setError('សូមជ្រើសថ្នាក់ជាមុន'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/admin/enrollment', { ...form, classroom_id: selected })
      showSuccess(`ចុះឈ្មោះ ${form.name_kh} ជោគជ័យ!`)
      closeModal()
      fetchStudents(selected)
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!statusTarget || !newStatus) return
    setUpdatingStatus(true)
    try {
      await api.patch(`/admin/enrollment/${statusTarget.id}/status`, {
        classroom_id: selected,
        status: newStatus,
      })
      showSuccess('ផ្លាស់ប្ដូរស្ថានភាពជោគជ័យ!')
      setStatusTarget(null)
      fetchStudents(selected)
    } catch (_) {}
    setUpdatingStatus(false)
  }

  const handleExportCSV = () => {
    const headers = ['លេខកូដ', 'ឈ្មោះខ្មែរ', 'ឈ្មោះអង់គ្លេស', 'ភេទ', 'ថ្ងៃខែឆ្នាំ', 'ស្ថានភាព']
    const rows = filtered.map(s => [
      s.student_code, s.name_kh, s.name_en,
      s.gender === 'male' ? 'ប្រុស' : 'ស្រី',
      s.date_of_birth || '',
      STATUS_CONFIG[s.pivot?.status || 'active']?.label || '',
    ])
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'students.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const selectedRoom = classrooms.find(c => c.id?.toString() === selected)

  // Filter + Paginate
  const filtered = students.filter(s => {
    const matchSearch = !search ||
      s.name_kh.includes(search) ||
      s.name_en.toLowerCase().includes(search.toLowerCase()) ||
      s.student_code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || (s.pivot?.status || 'active') === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  // Count by status
  const countByStatus = (key) => students.filter(s => (s.pivot?.status || 'active') === key).length

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'   },
        { label: 'គ្រប់គ្រង', path: '#'                                 },
        { label: 'ចុះឈ្មោះសិស្ស' },
      ]} />

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">ចុះឈ្មោះ និងគ្រប់គ្រងសិស្ស</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បន្ថែម និងគ្រប់គ្រងស្ថានភាពសិស្ស
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV}
            disabled={students.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-200
                       bg-green-50 text-green-700 hover:bg-green-100 text-sm
                       font-medium transition-colors disabled:opacity-40">
            <span className="material-icons text-base">download</span>
            Export CSV
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200
                            bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm
                            font-medium transition-colors cursor-pointer">
            <span className="material-icons text-base">upload</span>
            Import CSV
            <input type="file" accept=".csv" className="hidden"
              onChange={e => { alert('Import feature — coming soon!'); e.target.value = '' }} />
          </label>
          <button onClick={openModal} disabled={!selected}
            className="btn-primary disabled:opacity-50">
            <span className="material-icons text-lg">person_add</span>
            <span>ចុះឈ្មោះសិស្ស</span>
          </button>
        </div>
      </div>

      {/* Classroom Selector */}
      <div className="card">
        <div className="card-body py-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <RequiredLabel>ជ្រើសថ្នាក់រៀន</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">meeting_room</span>
                <select className="input-field pl-10"
                  value={selected}
                  onChange={e => handleClassroom(e.target.value)}>
                  <option value="">-- ជ្រើសថ្នាក់ --</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.grade?.name}
                      {c.track ? ` (${c.track === 'science' ? 'វិទ្យាសាស្ត្រពិត' : 'វិទ្យាសាស្ត្រសង្គម'})` : ' (ទូទៅ)'}
                      — {c.academic_year?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRoom && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100
                                rounded-xl px-4 py-2.5">
                  <span className="material-icons text-blue-600 text-xl">meeting_room</span>
                  <div>
                    <p className="font-bold text-blue-800 text-sm">{selectedRoom.name}</p>
                    <p className="text-blue-600 text-xs">{selectedRoom.grade?.name}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                  <p className="text-xs text-gray-500">/ {selectedRoom.max_students} នាក់</p>
                </div>
                {/* Progress bar */}
                <div className="w-32">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all
                        ${students.length / selectedRoom.max_students > 0.9
                          ? 'bg-red-500'
                          : students.length / selectedRoom.max_students > 0.7
                          ? 'bg-yellow-500'
                          : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, (students.length / selectedRoom.max_students) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 text-right">
                    {Math.round((students.length / selectedRoom.max_students) * 100)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Stats */}
      {selected && students.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button key={key}
              onClick={() => { setStatusFilter(statusFilter === key ? '' : key); setPage(1) }}
              className={`card p-3 flex items-center gap-3 transition-all
                          ${statusFilter === key
                            ? 'ring-2 ring-blue-500 ring-offset-1'
                            : 'hover:shadow-md'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                ${key === 'active'      ? 'bg-green-100'  :
                  key === 'transferred' ? 'bg-yellow-100' :
                  key === 'dropped'     ? 'bg-red-100'    : 'bg-blue-100'}`}>
                <span className={`material-icons text-lg
                  ${key === 'active'      ? 'text-green-600'  :
                    key === 'transferred' ? 'text-yellow-600' :
                    key === 'dropped'     ? 'text-red-500'    : 'text-blue-600'}`}>
                  {cfg.icon}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800">{countByStatus(key)}</p>
                <p className="text-xs text-gray-500">{cfg.label}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="card">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100
                        flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                                text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                w-60 bg-white"
                placeholder="ស្វែងរកសិស្ស..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                disabled={!selected} />
            </div>

            {statusFilter && (
              <button onClick={() => setStatusFilter('')}
                className="flex items-center gap-1 text-xs text-blue-600
                           bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5">
                <span className={`badge ${STATUS_CONFIG[statusFilter]?.cls} text-xs`}>
                  {STATUS_CONFIG[statusFilter]?.label}
                </span>
                <span className="material-icons text-sm">close</span>
              </button>
            )}
          </div>

          <span className="badge badge-blue">
            <span className="material-icons text-xs">groups</span>
            {filtered.length} នាក់
          </span>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">សិស្ស</th>
                <th className="table-th">លេខកូដ</th>
                <th className="table-th">ភេទ</th>
                <th className="table-th">ថ្ងៃខែឆ្នាំ</th>
                <th className="table-th">ទូរស័ព្ទ</th>
                <th className="table-th">អាណាព្យាបាល</th>
                <th className="table-th text-center">ស្ថានភាព</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {!selected && (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <span className="material-icons text-6xl text-gray-200 block mb-3">
                      meeting_room
                    </span>
                    <p className="text-gray-400">សូមជ្រើសថ្នាក់ដើម្បីមើលបញ្ជីសិស្ស</p>
                  </td>
                </tr>
              )}
              {selected && fetching && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                    </div>
                  </td>
                </tr>
              )}
              {selected && !fetching && paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <span className="material-icons text-5xl text-gray-200 block mb-3">school</span>
                    <p className="text-gray-400 text-sm">
                      {search ? 'រកមិនឃើញ' : 'គ្មានសិស្ស'}
                    </p>
                  </td>
                </tr>
              )}
              {paginated.map((s, i) => {
                const status    = s.pivot?.status || 'active'
                const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.active
                return (
                  <tr key={s.id} className="table-tr-hover">
                    <td className="table-td text-gray-400 text-xs">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center
                                        justify-center flex-shrink-0 font-bold text-sm
                          ${s.gender === 'female'
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-blue-100 text-blue-600'}`}>
                          {s.name_kh.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{s.name_kh}</p>
                          <p className="text-xs text-gray-400">{s.name_en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700
                                       px-2 py-1 rounded-md">
                        {s.student_code}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${s.gender === 'female' ? 'badge-red' : 'badge-blue'}`}>
                        <span className="material-icons text-xs">
                          {s.gender === 'female' ? 'female' : 'male'}
                        </span>
                        {s.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </span>
                    </td>
                    <td className="table-td text-sm text-gray-500">
                      {s.date_of_birth || '—'}
                    </td>
                    <td className="table-td text-sm text-gray-500">
                      {s.phone || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="table-td">
                      <p className="text-sm font-medium text-gray-700">{s.guardian_name}</p>
                      <p className="text-xs text-gray-400">{s.guardian_phone}</p>
                    </td>
                    <td className="table-td text-center">
                      <span className={`badge ${statusCfg.cls}`}>
                        <span className="material-icons text-xs">{statusCfg.icon}</span>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setStatusTarget(s)
                            setNewStatus(s.pivot?.status || 'active')
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                     bg-gray-50 hover:bg-gray-100 text-gray-600
                                     text-xs font-medium transition-colors border border-gray-200">
                          <span className="material-icons text-sm">manage_accounts</span>
                          ស្ថានភាព
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
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

      {/* ══ Enroll Modal ══ */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="ចុះឈ្មោះសិស្សថ្មី"
        icon="person_add"
        size="xl">

        {selectedRoom && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100
                          rounded-lg px-3 py-2 mb-5">
            <span className="material-icons text-blue-600 text-base">meeting_room</span>
            <p className="text-sm text-blue-700 font-medium">
              ចុះឈ្មោះចូលថ្នាក់: <strong>{selectedRoom.name}</strong>
              — {selectedRoom.grade?.name}
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-700 rounded-lg px-3 py-2.5 mb-4 text-sm">
            <span className="material-icons text-red-500 text-base">error_outline</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Section: Student Info */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-blue-600 text-lg">person</span>
              <p className="font-bold text-gray-700 text-sm">ព័ត៌មានសិស្ស</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <RequiredLabel>លេខកូដសិស្ស</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">badge</span>
                  <input className="input-field pl-10 font-mono"
                    placeholder="STU-001"
                    value={form.student_code}
                    onChange={e => setForm({ ...form, student_code: e.target.value })}
                    required />
                </div>
              </div>

              <div>
                <RequiredLabel>ថ្ងៃខែឆ្នាំកំណើត</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">cake</span>
                  <input type="date" className="input-field pl-10"
                    value={form.date_of_birth}
                    onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
                    required />
                </div>
              </div>

              <div>
                <RequiredLabel>ភេទ</RequiredLabel>
                <div className="flex gap-2">
                  {[
                    { val: 'male',   label: 'ប្រុស', icon: 'male'   },
                    { val: 'female', label: 'ស្រី',  icon: 'female' },
                  ].map(opt => (
                    <label key={opt.val}
                      className={`flex-1 flex items-center justify-center gap-2 border-2
                                  rounded-xl py-2.5 cursor-pointer transition-all
                                  ${form.gender === opt.val
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" className="sr-only"
                        value={opt.val}
                        checked={form.gender === opt.val}
                        onChange={() => setForm({ ...form, gender: opt.val })} />
                      <span className={`material-icons text-lg
                        ${form.gender === opt.val ? 'text-blue-600' : 'text-gray-400'}`}>
                        {opt.icon}
                      </span>
                      <span className={`text-sm font-semibold
                        ${form.gender === opt.val ? 'text-blue-700' : 'text-gray-500'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <RequiredLabel>ឈ្មោះជាខ្មែរ</RequiredLabel>
                <input className="input-field"
                  placeholder="ឧ: ហេង ស្រីនិច"
                  value={form.name_kh}
                  onChange={e => setForm({ ...form, name_kh: e.target.value })}
                  required />
              </div>

              <div>
                <RequiredLabel>ឈ្មោះជាអង់គ្លេស</RequiredLabel>
                <input className="input-field"
                  placeholder="e.g. Heng Srey Nich"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })}
                  required />
              </div>

              <div>
                <RequiredLabel optional>លេខទូរស័ព្ទ</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">phone</span>
                  <input className="input-field pl-10"
                    placeholder="0xx xxx xxx"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div className="md:col-span-3">
                <RequiredLabel optional>អាសយដ្ឋាន</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-3
                                   text-gray-400 text-lg pointer-events-none">location_on</span>
                  <textarea className="input-field pl-10 resize-none" rows={2}
                    placeholder="ភូមិ សង្កាត់ ក្រុង ខេត្ត"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider
                             flex items-center gap-1.5">
              <span className="material-icons text-sm">family_restroom</span>
              អាណាព្យាបាល
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Section: Guardian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <RequiredLabel>ឈ្មោះអាណាព្យាបាល</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  person_outline
                </span>
                <input className="input-field pl-10"
                  placeholder="ឈ្មោះ"
                  value={form.guardian_name}
                  onChange={e => setForm({ ...form, guardian_name: e.target.value })}
                  required />
              </div>
            </div>
            <div>
              <RequiredLabel>ទូរស័ព្ទអាណាព្យាបាល</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">phone</span>
                <input className="input-field pl-10"
                  placeholder="0xx xxx xxx"
                  value={form.guardian_phone}
                  onChange={e => setForm({ ...form, guardian_phone: e.target.value })}
                  required />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider
                             flex items-center gap-1.5">
              <span className="material-icons text-sm">lock</span>
              គណនីចូលប្រព័ន្ធ (ស្រេចចិត្ត)
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Section: Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <RequiredLabel optional>អ៊ីមែល</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  alternate_email
                </span>
                <input type="email" className="input-field pl-10"
                  placeholder="student@school.edu.kh"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                បញ្ចូលអ៊ីមែល ប្រសិនបើចង់ឲ្យសិស្សចូលប្រព័ន្ធបាន
              </p>
            </div>
            {form.email && (
              <div>
                <RequiredLabel>ពាក្យសម្ងាត់</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">lock_outline</span>
                  <input type="password" className="input-field pl-10"
                    placeholder="យ៉ាងហោចណាស់ ៦ ខ្ទង់"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required={!!form.email} />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="btn-secondary">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading
                ? <><Spinner /><span>កំពុងចុះឈ្មោះ...</span></>
                : <><span className="material-icons text-lg">person_add</span>
                   <span>ចុះឈ្មោះ</span></>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* ══ Status Update Modal ══ */}
      <Modal
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        title="ផ្លាស់ប្ដូរស្ថានភាពសិស្ស"
        icon="manage_accounts"
        size="sm">

        {statusTarget && (
          <div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                              font-bold text-sm flex-shrink-0
                ${statusTarget.gender === 'female'
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-blue-100 text-blue-600'}`}>
                {statusTarget.name_kh.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-800">{statusTarget.name_kh}</p>
                <p className="text-xs text-gray-400 font-mono">{statusTarget.student_code}</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <label key={key}
                  className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3
                              cursor-pointer transition-all
                              ${newStatus === key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" className="sr-only"
                    value={key}
                    checked={newStatus === key}
                    onChange={() => setNewStatus(key)} />
                  <span className={`badge ${cfg.cls}`}>
                    <span className="material-icons text-xs">{cfg.icon}</span>
                    {cfg.label}
                  </span>
                  {newStatus === key && (
                    <span className="material-icons text-green-500 text-base ml-auto">
                      check_circle
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStatusTarget(null)} className="btn-secondary flex-1">
                <span className="material-icons text-lg">close</span>
                <span>បោះបង់</span>
              </button>
              <button onClick={handleStatusUpdate} disabled={updatingStatus}
                className="btn-primary flex-1">
                {updatingStatus
                  ? <><Spinner /><span>កំពុង...</span></>
                  : <><span className="material-icons text-lg">save</span>
                     <span>រក្សាទុក</span></>
                }
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}