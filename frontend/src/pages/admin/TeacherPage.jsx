import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import Breadcrumb from '../../components/common/Breadcrumb'
import Pagination from '../../components/common/Pagination'
import Modal      from '../../components/common/Modal'
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
  teacher_code: '', name_kh: '', name_en: '',
  gender: 'male', phone: '', email: '', password: '',
}

export default function TeacherPage() {
  const [teachers, setTeachers]   = useState([])
  const [fetching, setFetching]   = useState(true)
  const [search,   setSearch]     = useState('')
  const [genderFilter, setGenderFilter] = useState('')

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

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const fetchTeachers = async () => {
    setFetching(true)
    try {
      const res = await api.get('/admin/teachers')
      setTeachers(res.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchTeachers() }, [])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    setForm({
      teacher_code: t.teacher_code,
      name_kh:      t.name_kh,
      name_en:      t.name_en,
      gender:       t.gender,
      phone:        t.phone || '',
      email:        t.user?.email || '',
      password:     '',
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
      if (editing) {
        await api.put(`/admin/teachers/${editing.id}`, form)
        showSuccess('កែប្រែព័ត៌មានគ្រូជោគជ័យ!')
      } else {
        await api.post('/admin/teachers', form)
        showSuccess('បន្ថែមគ្រូថ្មីជោគជ័យ!')
      }
      await fetchTeachers()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា សូមព្យាយាមម្តងទៀត')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await api.delete(`/admin/teachers/${id}`)
      showSuccess('លុបគ្រូជោគជ័យ!')
      setDeleteTarget(null)
      fetchTeachers()
    } catch (_) {}
    setDeleting(false)
  }

  const handleExportCSV = () => {
    const headers = ['លេខកូដ', 'ឈ្មោះខ្មែរ', 'ឈ្មោះអង់គ្លេស', 'ភេទ', 'ទូរស័ព្ទ', 'អ៊ីមែល']
    const rows    = filtered.map(t => [
      t.teacher_code, t.name_kh, t.name_en,
      t.gender === 'male' ? 'ប្រុស' : 'ស្រី',
      t.phone || '', t.user?.email || '',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'teachers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // Filter
  const filtered = teachers.filter(t => {
    const matchSearch = !search ||
      t.name_kh.includes(search) ||
      t.name_en.toLowerCase().includes(search.toLowerCase()) ||
      t.teacher_code.toLowerCase().includes(search.toLowerCase()) ||
      (t.user?.email || '').toLowerCase().includes(search.toLowerCase())
    const matchGender = !genderFilter || t.gender === genderFilter
    return matchSearch && matchGender
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  const handlePerPage = (n) => { setPerPage(n); setPage(1) }
  const handleSearch  = (v) => { setSearch(v); setPage(1) }

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'             },
        { label: 'គ្រប់គ្រង', path: '#'                                           },
        { label: 'បញ្ជីគ្រូបង្រៀន' },
      ]} />

      {/* Success Toast */}
      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងគ្រូបង្រៀន</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បន្ថែម កែប្រែ ឬ លុប ព័ត៌មានគ្រូបង្រៀន
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-200
                       bg-green-50 text-green-700 hover:bg-green-100 text-sm
                       font-medium transition-colors">
            <span className="material-icons text-base">download</span>
            Export CSV
          </button>

          {/* Import CSV */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200
                            bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm
                            font-medium transition-colors cursor-pointer">
            <span className="material-icons text-base">upload</span>
            Import CSV
            <input type="file" accept=".csv" className="hidden"
              onChange={(e) => {
                // Import CSV logic placeholder
                alert('Import CSV feature — coming soon!')
                e.target.value = ''
              }} />
          </label>

          {/* Add New */}
          <button onClick={openCreate} className="btn-primary">
            <span className="material-icons text-lg">person_add</span>
            <span>បន្ថែមគ្រូថ្មី</span>
          </button>
        </div>
      </div>

      {/* ── Main Table Card ── */}
      <div className="card">

        {/* Table Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100
                        flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                                text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                w-64 bg-white"
                placeholder="ស្វែងរកតាមឈ្មោះ លេខកូដ..."
                value={search}
                onChange={e => handleSearch(e.target.value)} />
              {search && (
                <button onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600">
                  <span className="material-icons text-base">close</span>
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={e => { setGenderFilter(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ភេទទាំងអស់</option>
              <option value="male">ប្រុស</option>
              <option value="female">ស្រី</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-purple">
              <span className="material-icons text-xs">supervisor_account</span>
              {filtered.length} នាក់
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">គ្រូបង្រៀន</th>
                <th className="table-th">លេខកូដ</th>
                <th className="table-th">ភេទ</th>
                <th className="table-th">ទូរស័ព្ទ</th>
                <th className="table-th">អ៊ីមែល</th>
                <th className="table-th">ស្ថានភាព</th>
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
                      supervisor_account
                    </span>
                    <p className="text-gray-400 text-sm">
                      {search ? 'រកមិនឃើញ' : 'គ្មានគ្រូបង្រៀន'}
                    </p>
                  </td>
                </tr>
              )}
              {paginated.map((t, i) => (
                <tr key={t.id} className="table-tr-hover">
                  <td className="table-td text-gray-400 text-xs">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                      flex-shrink-0 text-lg font-bold
                        ${t.gender === 'female'
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-blue-100 text-blue-600'}`}>
                        {t.name_kh.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{t.name_kh}</p>
                        <p className="text-xs text-gray-400">{t.name_en}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="font-mono text-xs bg-gray-100 text-gray-700
                                     px-2 py-1 rounded-md">
                      {t.teacher_code}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${t.gender === 'female' ? 'badge-red' : 'badge-blue'}`}>
                      <span className="material-icons text-xs">
                        {t.gender === 'female' ? 'female' : 'male'}
                      </span>
                      {t.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                    </span>
                  </td>
                  <td className="table-td text-sm text-gray-500">
                    {t.phone || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="table-td text-sm text-gray-500">
                    {t.user?.email}
                  </td>
                  <td className="table-td">
                    <span className="badge badge-green">
                      <span className="material-icons text-xs">check_circle</span>
                      សកម្ម
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEdit(t)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                   bg-blue-50 hover:bg-blue-100 text-blue-600
                                   text-xs font-medium transition-colors">
                        <span className="material-icons text-sm">edit</span>
                        កែ
                      </button>
                      <button onClick={() => setDeleteTarget(t)}
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
          onPerPageChange={handlePerPage}
        />
      </div>

      {/* ══ Add/Edit Modal ══ */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'កែប្រែព័ត៌មានគ្រូ' : 'បន្ថែមគ្រូបង្រៀនថ្មី'}
        icon={editing ? 'edit' : 'person_add'}
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

            {/* Teacher Code */}
            <div>
              <RequiredLabel>លេខកូដគ្រូ</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">badge</span>
                <input className="input-field pl-10 font-mono"
                  placeholder="ឧ: TCH-001"
                  value={form.teacher_code}
                  onChange={e => setForm({ ...form, teacher_code: e.target.value })}
                  required={!editing}
                  disabled={!!editing} />
              </div>
            </div>

            {/* Gender */}
            <div>
              <RequiredLabel>ភេទ</RequiredLabel>
              <div className="flex gap-3">
                {[
                  { val: 'male',   label: 'ប្រុស', icon: 'male'   },
                  { val: 'female', label: 'ស្រី',  icon: 'female' },
                ].map(opt => (
                  <label key={opt.val}
                    className={`flex-1 flex items-center gap-2.5 border-2 rounded-xl
                                px-4 py-3 cursor-pointer transition-all
                                ${form.gender === opt.val
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" className="sr-only"
                      value={opt.val}
                      checked={form.gender === opt.val}
                      onChange={() => setForm({ ...form, gender: opt.val })} />
                    <span className={`material-icons text-xl
                      ${form.gender === opt.val ? 'text-blue-600' : 'text-gray-400'}`}>
                      {opt.icon}
                    </span>
                    <span className={`font-semibold text-sm
                      ${form.gender === opt.val ? 'text-blue-700' : 'text-gray-600'}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Name KH */}
            <div>
              <RequiredLabel>ឈ្មោះជាភាសាខ្មែរ</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">person</span>
                <input className="input-field pl-10"
                  placeholder="ឧ: ចន្ទ សុភាព"
                  value={form.name_kh}
                  onChange={e => setForm({ ...form, name_kh: e.target.value })}
                  required />
              </div>
            </div>

            {/* Name EN */}
            <div>
              <RequiredLabel>ឈ្មោះជាភាសាអង់គ្លេស</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">person_outline</span>
                <input className="input-field pl-10"
                  placeholder="e.g. Chan Sopheak"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })}
                  required />
              </div>
            </div>

            {/* Phone */}
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

            {/* Divider — Account Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider
                                 flex items-center gap-1.5">
                  <span className="material-icons text-sm">lock</span>
                  គណនីចូលប្រព័ន្ធ
                </span>
                <div className="flex-1 border-t border-gray-200" />
              </div>
            </div>

            {/* Email */}
            <div>
              <RequiredLabel>{editing ? 'អ៊ីមែល (មិនអាចផ្លាស់ប្ដូរ)' : 'អ៊ីមែល'}</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  alternate_email
                </span>
                <input type="email" className="input-field pl-10"
                  placeholder="example@school.edu.kh"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required={!editing}
                  disabled={!!editing} />
              </div>
              {editing && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <span className="material-icons text-sm">info</span>
                  អ៊ីមែលមិនអាចផ្លាស់ប្ដូរបន្ទាប់ពីបង្កើតរួចហើយ
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <RequiredLabel optional={!!editing}>
                {editing ? 'ពាក្យសម្ងាត់ថ្មី' : 'ពាក្យសម្ងាត់'}
              </RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">lock_outline</span>
                <input type="password" className="input-field pl-10"
                  placeholder={editing ? 'ទុកទទេបើមិនផ្លាស់ប្ដូរ' : 'យ៉ាងហោចណាស់ ៦ ខ្ទង់'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required={!editing} />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
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
                    <span>{editing ? 'រក្សាទុក' : 'បន្ថែមគ្រូ'}</span>
                  </>
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* ══ Delete Confirm Modal ══ */}
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
            លុបគ្រូ "{deleteTarget?.name_kh}"?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            ការលុបនេះមិនអាចត្រឡប់វិញបានទេ។
            ទិន្នន័យទាំងអស់ពាក់ព័ន្ធនឹងគ្រូនេះនឹងត្រូវលុបចោល។
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)}
              className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button
              onClick={() => handleDelete(deleteTarget?.id)}
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