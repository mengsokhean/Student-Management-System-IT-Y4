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

const EMPTY_FORM = { name: '', start_date: '', end_date: '', is_active: false }

export default function AcademicYearPage() {
  const [years,    setYears]    = useState([])
  const [fetching, setFetching] = useState(true)
  const [page,     setPage]     = useState(1)
  const [perPage,  setPerPage]  = useState(10)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const fetchYears = async () => {
    setFetching(true)
    try {
      const res = await api.get('/admin/academic-years')
      setYears(res.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchYears() }, [])

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

  const openEdit = (y) => {
    setEditing(y)
    setForm({ name: y.name, start_date: y.start_date, end_date: y.end_date, is_active: y.is_active })
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
        await api.put(`/admin/academic-years/${editing.id}`, form)
        showSuccess('កែប្រែឆ្នាំសិក្សាជោគជ័យ!')
      } else {
        await api.post('/admin/academic-years', form)
        showSuccess('បន្ថែមឆ្នាំសិក្សាថ្មីជោគជ័យ!')
      }
      await fetchYears()
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
      await api.delete(`/admin/academic-years/${id}`)
      showSuccess('លុបឆ្នាំសិក្សាជោគជ័យ!')
      setDeleteTarget(null)
      fetchYears()
    } catch (_) {}
    setDeleting(false)
  }

  const totalPages = Math.ceil(years.length / perPage)
  const paginated  = years.slice((page - 1) * perPage, page * perPage)

  const activeYear = years.find(y => y.is_active)

  return (
    <div className="space-y-4">

      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'      },
        { label: 'គ្រប់គ្រង', path: '#'                                    },
        { label: 'ឆ្នាំសិក្សា' },
      ]} />

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* Active Year Banner */}
      {activeYear && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-4
                        flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center
                            justify-center">
              <span className="material-icons text-white text-xl">event_available</span>
            </div>
            <div>
              <p className="text-blue-100 text-xs">ឆ្នាំសិក្សាសកម្មបច្ចុប្បន្ន</p>
              <p className="font-bold text-lg">{activeYear.name}</p>
              <p className="text-blue-200 text-xs">
                {activeYear.start_date} → {activeYear.end_date}
              </p>
            </div>
          </div>
          <span className="badge bg-white bg-opacity-20 text-white border border-white
                           border-opacity-30">
            <span className="material-icons text-sm">check_circle</span>
            សកម្ម
          </span>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងឆ្នាំសិក្សា</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បន្ថែម កែប្រែ ឬ លុប ឆ្នាំសិក្សា
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <span className="material-icons text-lg">add_circle</span>
          <span>បន្ថែមឆ្នាំសិក្សា</span>
        </button>
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-icons text-blue-600 text-xl">event_note</span>
            <h3 className="font-bold text-gray-800 text-sm">បញ្ជីឆ្នាំសិក្សា</h3>
          </div>
          <span className="badge badge-blue">{years.length} ឆ្នាំ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">ឈ្មោះ</th>
                <th className="table-th">ចាប់ផ្តើម</th>
                <th className="table-th">បញ្ចប់</th>
                <th className="table-th">រយៈពេល</th>
                <th className="table-th text-center">ស្ថានភាព</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={7} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr><td colSpan={7} className="py-16 text-center">
                  <span className="material-icons text-5xl text-gray-200 block mb-3">
                    event_note
                  </span>
                  <p className="text-gray-400 text-sm">គ្មានឆ្នាំសិក្សា</p>
                </td></tr>
              )}
              {paginated.map((y, i) => {
                const start   = new Date(y.start_date)
                const end     = new Date(y.end_date)
                const months  = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30))
                return (
                  <tr key={y.id}
                    className={`table-tr-hover ${y.is_active ? 'bg-blue-50/40' : ''}`}>
                    <td className="table-td text-gray-400 text-xs">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center
                                        justify-center flex-shrink-0
                          ${y.is_active ? 'bg-blue-600' : 'bg-gray-100'}`}>
                          <span className={`material-icons text-base
                            ${y.is_active ? 'text-white' : 'text-gray-400'}`}>
                            event_note
                          </span>
                        </div>
                        <span className="font-bold text-gray-800">{y.name}</span>
                      </div>
                    </td>
                    <td className="table-td text-gray-600 font-mono text-sm">
                      {y.start_date}
                    </td>
                    <td className="table-td text-gray-600 font-mono text-sm">
                      {y.end_date}
                    </td>
                    <td className="table-td">
                      <span className="text-xs text-gray-500">
                        {months} ខែ
                      </span>
                    </td>
                    <td className="table-td text-center">
                      {y.is_active
                        ? <span className="badge badge-green">
                            <span className="material-icons text-xs">check_circle</span>
                            សកម្ម
                          </span>
                        : <span className="badge badge-gray">
                            <span className="material-icons text-xs">
                              radio_button_unchecked
                            </span>
                            អសកម្ម
                          </span>
                      }
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(y)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600
                                     text-xs font-medium transition-colors">
                          <span className="material-icons text-sm">edit</span>
                          កែ
                        </button>
                        <button onClick={() => setDeleteTarget(y)}
                          disabled={y.is_active}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                     bg-red-50 hover:bg-red-100 text-red-500
                                     text-xs font-medium transition-colors
                                     disabled:opacity-40 disabled:cursor-not-allowed">
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
          total={years.length}
          onPageChange={setPage}
          onPerPageChange={(n) => { setPerPage(n); setPage(1) }}
        />
      </div>

      {/* ══ Create/Edit Modal ══ */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'កែប្រែឆ្នាំសិក្សា' : 'បន្ថែមឆ្នាំសិក្សាថ្មី'}
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
            <RequiredLabel>ឈ្មោះឆ្នាំសិក្សា</RequiredLabel>
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg pointer-events-none">event_note</span>
              <input className="input-field pl-10"
                placeholder="ឧ: 2024-2025"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <RequiredLabel>ថ្ងៃចាប់ផ្តើម</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  calendar_today
                </span>
                <input type="date" className="input-field pl-10"
                  value={form.start_date}
                  onChange={e => setForm({ ...form, start_date: e.target.value })}
                  required />
              </div>
            </div>
            <div>
              <RequiredLabel>ថ្ងៃបញ្ចប់</RequiredLabel>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  event
                </span>
                <input type="date" className="input-field pl-10"
                  value={form.end_date}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  required />
              </div>
            </div>
          </div>

          <label className={`flex items-center gap-4 border-2 rounded-xl px-4 py-3.5
                            cursor-pointer transition-all
                            ${form.is_active
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'}`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center
                            transition-all flex-shrink-0
                            ${form.is_active
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'}`}>
              {form.is_active && (
                <span className="material-icons text-white text-sm">check</span>
              )}
            </div>
            <input type="checkbox" className="sr-only"
              checked={form.is_active}
              onChange={e => setForm({ ...form, is_active: e.target.checked })} />
            <div>
              <p className={`font-semibold text-sm
                ${form.is_active ? 'text-blue-700' : 'text-gray-700'}`}>
                កំណត់ជាឆ្នាំសិក្សាសកម្ម
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                ឆ្នាំសិក្សាមុន នឹងក្លាយជាអសកម្មដោយស្វ័យប្រវត្តិ
              </p>
            </div>
          </label>

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
            លុបឆ្នាំ "{deleteTarget?.name}"?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            ថ្នាក់រៀន សិស្ស វត្តមាន និងពិន្ទុទាំងអស់
            ក្នុងឆ្នាំនេះនឹងត្រូវលុបចោល
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