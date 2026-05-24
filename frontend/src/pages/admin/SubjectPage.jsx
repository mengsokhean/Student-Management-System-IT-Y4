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

const EMPTY_FORM = { name_kh: '', name_en: '', code: '' }

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([])
  const [fetching, setFetching] = useState(true)
  const [search,   setSearch]   = useState('')

  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const fetchSubjects = async () => {
    setFetching(true)
    try {
      const res = await api.get('/admin/subjects')
      setSubjects(res.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchSubjects() }, [])

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

  const openEdit = (s) => {
    setEditing(s)
    setForm({ name_kh: s.name_kh, name_en: s.name_en, code: s.code })
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
        await api.put(`/admin/subjects/${editing.id}`, form)
        showSuccess('កែប្រែមុខវិជ្ជាជោគជ័យ!')
      } else {
        await api.post('/admin/subjects', form)
        showSuccess('បន្ថែមមុខវិជ្ជាថ្មីជោគជ័យ!')
      }
      await fetchSubjects()
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
      await api.delete(`/admin/subjects/${id}`)
      showSuccess('លុបមុខវិជ្ជាជោគជ័យ!')
      setDeleteTarget(null)
      fetchSubjects()
    } catch (_) {}
    setDeleting(false)
  }

  const filtered = subjects.filter(s =>
    !search ||
    s.name_kh.includes(search) ||
    s.name_en.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-4">

      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'  },
        { label: 'គ្រប់គ្រង', path: '#'                                },
        { label: 'មុខវិជ្ជា' },
      ]} />

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងមុខវិជ្ជា</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បន្ថែម កែប្រែ ឬ លុប មុខវិជ្ជានៅក្នុងប្រព័ន្ធ
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <span className="material-icons text-lg">add_circle</span>
          <span>បន្ថែមមុខវិជ្ជា</span>
        </button>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100
                        flex items-center justify-between flex-wrap gap-3">
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                             text-gray-400 text-lg">search</span>
            <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                              text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                              w-64 bg-white"
              placeholder="ស្វែងរកមុខវិជ្ជា..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <span className="badge badge-green">
            <span className="material-icons text-xs">menu_book</span>
            {filtered.length} មុខវិជ្ជា
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">ឈ្មោះខ្មែរ</th>
                <th className="table-th">ឈ្មោះអង់គ្លេស</th>
                <th className="table-th">លេខកូដ</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={5} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr><td colSpan={5} className="py-16 text-center">
                  <span className="material-icons text-5xl text-gray-200 block mb-3">
                    menu_book
                  </span>
                  <p className="text-gray-400 text-sm">
                    {search ? 'រកមិនឃើញ' : 'គ្មានមុខវិជ្ជា'}
                  </p>
                </td></tr>
              )}
              {paginated.map((s, i) => (
                <tr key={s.id} className="table-tr-hover">
                  <td className="table-td text-gray-400 text-xs">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center
                                      justify-center flex-shrink-0">
                        <span className="material-icons text-green-600 text-base">menu_book</span>
                      </div>
                      <span className="font-bold text-gray-800">{s.name_kh}</span>
                    </div>
                  </td>
                  <td className="table-td text-gray-600">{s.name_en}</td>
                  <td className="table-td">
                    <span className="font-mono text-xs bg-blue-50 text-blue-700
                                     border border-blue-200 px-2.5 py-1 rounded-md font-semibold">
                      {s.code}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEdit(s)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                   bg-blue-50 hover:bg-blue-100 text-blue-600
                                   text-xs font-medium transition-colors">
                        <span className="material-icons text-sm">edit</span>
                        កែ
                      </button>
                      <button onClick={() => setDeleteTarget(s)}
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
        title={editing ? 'កែប្រែមុខវិជ្ជា' : 'បន្ថែមមុខវិជ្ជាថ្មី'}
        icon={editing ? 'edit' : 'add_circle'}
        size="md">

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-700 rounded-lg px-3 py-2.5 mb-5 text-sm">
            <span className="material-icons text-red-500 text-base">error_outline</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <RequiredLabel>ឈ្មោះជាភាសាខ្មែរ</RequiredLabel>
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg pointer-events-none">menu_book</span>
              <input className="input-field pl-10"
                placeholder="ឧ: គណិតវិទ្យា"
                value={form.name_kh}
                onChange={e => setForm({ ...form, name_kh: e.target.value })}
                required />
            </div>
          </div>

          <div>
            <RequiredLabel>ឈ្មោះជាភាសាអង់គ្លេស</RequiredLabel>
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg pointer-events-none">translate</span>
              <input className="input-field pl-10"
                placeholder="e.g. Mathematics"
                value={form.name_en}
                onChange={e => setForm({ ...form, name_en: e.target.value })}
                required />
            </div>
          </div>

          <div>
            <RequiredLabel>លេខកូដ (Code)</RequiredLabel>
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg pointer-events-none">tag</span>
              <input className="input-field pl-10 font-mono uppercase"
                placeholder="ឧ: MATH"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              លេខកូដត្រូវតែប្លែក ហើយប្រើអក្សរធំ
            </p>
          </div>

          {/* Preview */}
          {form.name_kh && form.code && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl
                            flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center
                              justify-center flex-shrink-0">
                <span className="material-icons text-green-600 text-lg">menu_book</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{form.name_kh}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-400">{form.name_en}</p>
                  <span className="font-mono text-xs bg-blue-50 text-blue-700
                                   border border-blue-200 px-1.5 py-0.5 rounded font-semibold">
                    {form.code}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading
                ? <><Spinner /><span>រក្សាទុក...</span></>
                : <><span className="material-icons text-lg">save</span>
                   <span>{editing ? 'រក្សាទុក' : 'បន្ថែម'}</span></>
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
            លុប "{deleteTarget?.name_kh}"?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            ការចាត់តាំងមុខវិជ្ជានេះទៅ Grade ទាំងអស់នឹងត្រូវលុបផងដែរ
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span>
              <span>បោះបង់</span>
            </button>
            <button onClick={() => handleDelete(deleteTarget?.id)}
              disabled={deleting} className="btn-danger flex-1">
              {deleting
                ? <><Spinner /><span>លុប...</span></>
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