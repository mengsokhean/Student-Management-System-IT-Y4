import { useEffect, useState } from 'react'
import api from '../../lib/axios'

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([])
  const [form, setForm]         = useState({ name_kh: '', name_en: '', code: '' })
  const [editing, setEditing]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [search, setSearch]     = useState('')

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/admin/subjects')
      setSubjects(res.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchSubjects() }, [])

  const resetForm = () => {
    setForm({ name_kh: '', name_en: '', code: '' })
    setEditing(null)
    setError('')
  }

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (editing) {
        await api.put(`/admin/subjects/${editing.id}`, form)
        showSuccess('កែប្រែជោគជ័យ!')
      } else {
        await api.post('/admin/subjects', form)
        showSuccess('បន្ថែមជោគជ័យ!')
      }
      await fetchSubjects()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (s) => {
    setEditing(s)
    setForm({ name_kh: s.name_kh, name_en: s.name_en, code: s.code })
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបមុខវិជ្ជានេះមែនទេ?')) return
    try {
      await api.delete(`/admin/subjects/${id}`)
      showSuccess('លុបជោគជ័យ!')
      fetchSubjects()
    } catch (_) {}
  }

  const filtered = subjects.filter(s =>
    s.name_kh.includes(search) ||
    s.name_en.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">គ្រប់គ្រងមុខវិជ្ជា</h2>
          <p className="text-sm text-gray-500 mt-0.5">បន្ថែម កែប្រែ ឬ លុប មុខវិជ្ជា</p>
        </div>
        <span className="badge badge-green">
          <span className="material-icons text-xs">menu_book</span>
          {subjects.length} មុខវិជ្ជា
        </span>
      </div>

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-lg px-4 py-3 text-sm">
          <span className="material-icons text-green-500 text-base">check_circle</span>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Form */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-green-600 text-xl">
                {editing ? 'edit' : 'add_circle'}
              </span>
              <h3 className="font-bold text-gray-800 text-sm">
                {editing ? 'កែប្រែមុខវិជ្ជា' : 'បន្ថែមមុខវិជ្ជា'}
              </h3>
            </div>
            {editing && (
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <span className="material-icons text-xl">close</span>
              </button>
            )}
          </div>
          <div className="card-body">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200
                              text-red-700 rounded-lg px-3 py-2.5 mb-4 text-sm">
                <span className="material-icons text-red-500 text-base">error_outline</span>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">ឈ្មោះជាភាសាខ្មែរ</label>
                <input className="input-field" placeholder="ឧ: គណិតវិទ្យា"
                  value={form.name_kh}
                  onChange={e => setForm({ ...form, name_kh: e.target.value })}
                  required />
              </div>
              <div>
                <label className="input-label">ឈ្មោះជាភាសាអង់គ្លេស</label>
                <input className="input-field" placeholder="e.g. Mathematics"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })}
                  required />
              </div>
              <div>
                <label className="input-label">លេខកូដ</label>
                <input className="input-field font-mono" placeholder="ឧ: MATH"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>កំពុងរក្សាទុក...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-lg">save</span>
                      <span>{editing ? 'រក្សាទុក' : 'បន្ថែម'}</span>
                    </>
                  )}
                </button>
                {editing && (
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    <span className="material-icons text-lg">close</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-3 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-green-600 text-xl">list</span>
              <h3 className="font-bold text-gray-800 text-sm">បញ្ជីមុខវិជ្ជា</h3>
            </div>
          </div>
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="input-field pl-10 py-2 text-sm"
                placeholder="ស្វែងរកមុខវិជ្ជា..."
                value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">#</th>
                  <th className="table-th">ឈ្មោះខ្មែរ</th>
                  <th className="table-th">ឈ្មោះអង់គ្លេស</th>
                  <th className="table-th">កូដ</th>
                  <th className="table-th text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {fetching && (
                  <tr>
                    <td colSpan={5} className="table-td text-center py-10">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                          fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span className="text-sm">កំពុងផ្ទុក...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!fetching && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="table-td text-center py-10">
                      <span className="material-icons text-4xl text-gray-200 block mb-2">
                        menu_book
                      </span>
                      <p className="text-sm text-gray-400">
                        {search ? 'រកមិនឃើញ' : 'គ្មានមុខវិជ្ជា'}
                      </p>
                    </td>
                  </tr>
                )}
                {filtered.map((s, i) => (
                  <tr key={s.id}
                    className={`table-tr-hover ${editing?.id === s.id ? 'bg-green-50' : ''}`}>
                    <td className="table-td text-gray-400 text-xs w-10">{i + 1}</td>
                    <td className="table-td font-bold text-gray-800">{s.name_kh}</td>
                    <td className="table-td text-gray-600">{s.name_en}</td>
                    <td className="table-td">
                      <span className="badge badge-blue font-mono">{s.code}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(s)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
                          <span className="material-icons text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(s.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                          <span className="material-icons text-base">delete_outline</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}