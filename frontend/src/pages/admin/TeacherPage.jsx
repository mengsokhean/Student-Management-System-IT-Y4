import { useEffect, useState } from 'react'
import api from '../../lib/axios'

export default function TeacherPage() {
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({
    teacher_code: '', name_kh: '', name_en: '',
    gender: 'male', phone: '', email: '', password: '',
  })
  const [editing, setEditing]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [search, setSearch]     = useState('')

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers')
      setTeachers(res.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchTeachers() }, [])

  const resetForm = () => {
    setForm({
      teacher_code: '', name_kh: '', name_en: '',
      gender: 'male', phone: '', email: '', password: '',
    })
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
        await api.put(`/admin/teachers/${editing.id}`, form)
        showSuccess('កែប្រែជោគជ័យ!')
      } else {
        await api.post('/admin/teachers', form)
        showSuccess('បន្ថែមគ្រូជោគជ័យ!')
      }
      await fetchTeachers()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (t) => {
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
  }

  const handleDelete = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបគ្រូនេះមែនទេ?')) return
    try {
      await api.delete(`/admin/teachers/${id}`)
      showSuccess('លុបជោគជ័យ!')
      fetchTeachers()
    } catch (_) {}
  }

  const filtered = teachers.filter(t =>
    t.name_kh.includes(search) ||
    t.name_en.toLowerCase().includes(search.toLowerCase()) ||
    t.teacher_code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">គ្រប់គ្រងគ្រូបង្រៀន</h2>
          <p className="text-sm text-gray-500 mt-0.5">បន្ថែម កែប្រែ ឬ លុប គ្រូបង្រៀន</p>
        </div>
        <span className="badge badge-purple">
          <span className="material-icons text-xs">supervisor_account</span>
          {teachers.length} នាក់
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
              <span className="material-icons text-purple-600 text-xl">
                {editing ? 'edit' : 'person_add'}
              </span>
              <h3 className="font-bold text-gray-800 text-sm">
                {editing ? 'កែប្រែគ្រូ' : 'បន្ថែមគ្រូថ្មី'}
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
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="input-label">លេខកូដគ្រូ</label>
                <input className="input-field font-mono" placeholder="ឧ: TCH-001"
                  value={form.teacher_code}
                  onChange={e => setForm({ ...form, teacher_code: e.target.value })}
                  required={!editing} disabled={!!editing} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">ឈ្មោះខ្មែរ</label>
                  <input className="input-field" placeholder="ឧ: សុភា"
                    value={form.name_kh}
                    onChange={e => setForm({ ...form, name_kh: e.target.value })}
                    required />
                </div>
                <div>
                  <label className="input-label">ឈ្មោះអង់គ្លេស</label>
                  <input className="input-field" placeholder="e.g. Sophea"
                    value={form.name_en}
                    onChange={e => setForm({ ...form, name_en: e.target.value })}
                    required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">ភេទ</label>
                  <select className="input-field"
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="male">ប្រុស</option>
                    <option value="female">ស្រី</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">លេខទូរស័ព្ទ</label>
                  <input className="input-field" placeholder="0xx xxx xxx"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="pt-1 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  គណនីចូលប្រព័ន្ធ
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="input-label">អ៊ីមែល</label>
                    <input type="email" className="input-field"
                      placeholder="example@school.edu.kh"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required={!editing}
                      disabled={!!editing} />
                  </div>
                  <div>
                    <label className="input-label">
                      ពាក្យសម្ងាត់
                      {editing && <span className="text-gray-400 font-normal ml-1">(ទុកទទេបើមិនផ្លាស់ប្តូរ)</span>}
                    </label>
                    <input type="password" className="input-field"
                      placeholder={editing ? '••••••••' : 'ពាក្យសម្ងាត់'}
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required={!editing} />
                  </div>
                </div>
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
              <span className="material-icons text-purple-600 text-xl">list</span>
              <h3 className="font-bold text-gray-800 text-sm">បញ្ជីគ្រូបង្រៀន</h3>
            </div>
          </div>
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="input-field pl-10 py-2 text-sm"
                placeholder="ស្វែងរកគ្រូ..."
                value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">#</th>
                  <th className="table-th">គ្រូ</th>
                  <th className="table-th">ភេទ</th>
                  <th className="table-th">ទូរស័ព្ទ</th>
                  <th className="table-th">អ៊ីមែល</th>
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
                    <td colSpan={6} className="table-td text-center py-10">
                      <span className="material-icons text-4xl text-gray-200 block mb-2">
                        supervisor_account
                      </span>
                      <p className="text-sm text-gray-400">
                        {search ? 'រកមិនឃើញ' : 'គ្មានគ្រូ'}
                      </p>
                    </td>
                  </tr>
                )}
                {filtered.map((t, i) => (
                  <tr key={t.id}
                    className={`table-tr-hover ${editing?.id === t.id ? 'bg-purple-50' : ''}`}>
                    <td className="table-td text-gray-400 text-xs w-10">{i + 1}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                          ${t.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                          <span className={`material-icons text-base
                            ${t.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                            person
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{t.name_kh}</p>
                          <p className="text-xs text-gray-400">{t.teacher_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${t.gender === 'female' ? 'badge-red' : 'badge-blue'}`}>
                        {t.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </span>
                    </td>
                    <td className="table-td text-gray-500 text-xs">
                      {t.phone || '—'}
                    </td>
                    <td className="table-td text-gray-500 text-xs">
                      {t.user?.email}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(t)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
                          <span className="material-icons text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(t.id)}
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