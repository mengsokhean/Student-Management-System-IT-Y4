import { useEffect, useState } from 'react'
import api from '../../lib/axios'

export default function AcademicYearPage() {
  const [years, setYears]     = useState([])
  const [form, setForm]       = useState({ name: '', start_date: '', end_date: '', is_active: false })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const fetchYears = async () => {
    try {
      const res = await api.get('/admin/academic-years')
      setYears(res.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchYears() }, [])

  const resetForm = () => {
    setForm({ name: '', start_date: '', end_date: '', is_active: false })
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
        await api.put(`/admin/academic-years/${editing.id}`, form)
        showSuccess('កែប្រែជោគជ័យ!')
      } else {
        await api.post('/admin/academic-years', form)
        showSuccess('បន្ថែមជោគជ័យ!')
      }
      await fetchYears()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុក')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (y) => {
    setEditing(y)
    setForm({ name: y.name, start_date: y.start_date, end_date: y.end_date, is_active: y.is_active })
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបឆ្នាំសិក្សានេះមែនទេ?')) return
    try {
      await api.delete(`/admin/academic-years/${id}`)
      showSuccess('លុបជោគជ័យ!')
      fetchYears()
    } catch (_) {}
  }

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">គ្រប់គ្រងឆ្នាំសិក្សា</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បន្ថែម កែប្រែ ឬ លុប ឆ្នាំសិក្សា
          </p>
        </div>
        <span className="badge badge-blue">
          <span className="material-icons text-xs">event_note</span>
          {years.length} ឆ្នាំ
        </span>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-lg px-4 py-3 text-sm">
          <span className="material-icons text-green-500 text-base">check_circle</span>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Form ── */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">
                {editing ? 'edit' : 'add_circle'}
              </span>
              <h3 className="font-bold text-gray-800 text-sm">
                {editing ? 'កែប្រែឆ្នាំសិក្សា' : 'បន្ថែមឆ្នាំសិក្សា'}
              </h3>
            </div>
            {editing && (
              <button onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors">
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
                <label className="input-label">ឈ្មោះឆ្នាំសិក្សា</label>
                <input className="input-field" placeholder="ឧទា: 2024-2025"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required />
              </div>
              <div>
                <label className="input-label">កាលបរិច្ឆេទចាប់ផ្តើម</label>
                <input type="date" className="input-field"
                  value={form.start_date}
                  onChange={e => setForm({ ...form, start_date: e.target.value })}
                  required />
              </div>
              <div>
                <label className="input-label">កាលបរិច្ឆេទបញ្ចប់</label>
                <input type="date" className="input-field"
                  value={form.end_date}
                  onChange={e => setForm({ ...form, end_date: e.target.value })}
                  required />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="is_active"
                  className="w-4 h-4 rounded accent-blue-600"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  កំណត់ជាឆ្នាំសិក្សាសកម្ម
                </label>
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
                    <span>លែកចោល</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="lg:col-span-3 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">list</span>
              <h3 className="font-bold text-gray-800 text-sm">បញ្ជីឆ្នាំសិក្សា</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">#</th>
                  <th className="table-th">ឈ្មោះ</th>
                  <th className="table-th">ចាប់ផ្តើម</th>
                  <th className="table-th">បញ្ចប់</th>
                  <th className="table-th">ស្ថានភាព</th>
                  <th className="table-th text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {fetching && (
                  <tr>
                    <td colSpan={6} className="table-td text-center py-10">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                          fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <span className="text-sm">កំពុងផ្ទុក...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!fetching && years.length === 0 && (
                  <tr>
                    <td colSpan={6} className="table-td text-center py-10">
                      <span className="material-icons text-4xl text-gray-200 block mb-2">
                        event_note
                      </span>
                      <p className="text-sm text-gray-400">គ្មានឆ្នាំសិក្សា</p>
                    </td>
                  </tr>
                )}
                {years.map((y, i) => (
                  <tr key={y.id}
                    className={`table-tr-hover ${editing?.id === y.id ? 'bg-blue-50' : ''}`}>
                    <td className="table-td text-gray-400 text-xs w-10">{i + 1}</td>
                    <td className="table-td font-bold text-gray-800">{y.name}</td>
                    <td className="table-td text-gray-600 text-xs">{y.start_date}</td>
                    <td className="table-td text-gray-600 text-xs">{y.end_date}</td>
                    <td className="table-td">
                      {y.is_active
                        ? <span className="badge badge-green">
                            <span className="material-icons text-xs">check_circle</span>
                            សកម្ម
                          </span>
                        : <span className="badge badge-gray">
                            <span className="material-icons text-xs">radio_button_unchecked</span>
                            អសកម្ម
                          </span>
                      }
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(y)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600
                                     transition-colors" title="កែប្រែ">
                          <span className="material-icons text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(y.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-red-50 hover:bg-red-100 text-red-500
                                     transition-colors" title="លុប">
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