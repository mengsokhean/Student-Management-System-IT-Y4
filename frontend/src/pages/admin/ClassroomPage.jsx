import { useEffect, useState } from 'react'
import api from '../../lib/axios'

export default function ClassroomPage() {
  const [classrooms, setClassrooms] = useState([])
  const [years, setYears]           = useState([])
  const [grades, setGrades]         = useState([])
  const [form, setForm] = useState({
    academic_year_id: '', grade_id: '', name: '',
    track: '', max_students: 45,
  })
  const [editing, setEditing]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [fetching, setFetching]   = useState(true)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [filterYear, setFilterYear] = useState('')

  const fetchAll = async () => {
    try {
      const [cr, yr, gr] = await Promise.all([
        api.get('/admin/classrooms', filterYear ? { params: { academic_year_id: filterYear } } : {}),
        api.get('/admin/academic-years'),
        api.get('/admin/grades'),
      ])
      setClassrooms(cr.data)
      setYears(yr.data)
      setGrades(gr.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchAll() }, [filterYear])

  const resetForm = () => {
    setForm({ academic_year_id: '', grade_id: '', name: '', track: '', max_students: 45 })
    setEditing(null)
    setError('')
  }

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  // កំណត់ track options តាម grade level
  const selectedLevel = grades.find(g => g.id == form.grade_id)?.level

  const trackOptions = () => {
    if (!selectedLevel) return []
    if (selectedLevel === '10') {
      return [{ value: '', label: 'ទូទៅ (ថ្នាក់ទី១០)' }]
    }
    return [
      { value: 'science',       label: 'វិទ្យាសាស្ត្រពិត'   },
      { value: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម' },
    ]
  }

  // auto-set track when grade 10 selected
  useEffect(() => {
    if (selectedLevel === '10') {
      setForm(f => ({ ...f, track: '' }))
    }
  }, [selectedLevel])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        track: form.track || null,
        max_students: Number(form.max_students),
      }
      if (editing) {
        await api.put(`/admin/classrooms/${editing.id}`, payload)
        showSuccess('កែប្រែជោគជ័យ!')
      } else {
        await api.post('/admin/classrooms', payload)
        showSuccess('បន្ថែមជោគជ័យ!')
      }
      await fetchAll()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (c) => {
    setEditing(c)
    setForm({
      academic_year_id: c.academic_year_id,
      grade_id:         c.grade_id,
      name:             c.name,
      track:            c.track || '',
      max_students:     c.max_students,
    })
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបថ្នាក់រៀននេះមែនទេ?')) return
    try {
      await api.delete(`/admin/classrooms/${id}`)
      showSuccess('លុបជោគជ័យ!')
      fetchAll()
    } catch (_) {}
  }

  const trackBadge = (track) => {
    if (track === 'science')
      return <span className="badge badge-green"><span className="material-icons text-xs">science</span>វិទ្យាសាស្ត្រពិត</span>
    if (track === 'social_science')
      return <span className="badge badge-purple"><span className="material-icons text-xs">public</span>វិទ្យាសាស្ត្រសង្គម</span>
    return <span className="badge badge-gray"><span className="material-icons text-xs">school</span>ទូទៅ</span>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">គ្រប់គ្រងថ្នាក់រៀន</h2>
          <p className="text-sm text-gray-500 mt-0.5">បន្ថែម កែប្រែ ឬ លុប ថ្នាក់រៀន</p>
        </div>
        <span className="badge badge-blue">
          <span className="material-icons text-xs">meeting_room</span>
          {classrooms.length} ថ្នាក់
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

        {/* ── Form ── */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">
                {editing ? 'edit' : 'add_circle'}
              </span>
              <h3 className="font-bold text-gray-800 text-sm">
                {editing ? 'កែប្រែថ្នាក់' : 'បង្កើតថ្នាក់'}
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

              {/* ឆ្នាំសិក្សា */}
              <div>
                <label className="input-label">ឆ្នាំសិក្សា</label>
                <select className="input-field"
                  value={form.academic_year_id}
                  onChange={e => setForm({ ...form, academic_year_id: e.target.value })}
                  required>
                  <option value="">-- ជ្រើសរើស --</option>
                  {years.map(y => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
              </div>

              {/* ថ្នាក់ទី */}
              <div>
                <label className="input-label">ថ្នាក់ទី</label>
                <select className="input-field"
                  value={form.grade_id}
                  onChange={e => setForm({ ...form, grade_id: e.target.value, track: '' })}
                  required>
                  <option value="">-- ជ្រើសរើស --</option>
                  {grades.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              {/* កម្មវិធីសិក្សា (Track) */}
              <div>
                <label className="input-label">
                  កម្មវិធីសិក្សា
                  {!form.grade_id && (
                    <span className="text-gray-400 font-normal ml-1">(ជ្រើសថ្នាក់ទីជាមុន)</span>
                  )}
                </label>
                <select
                  className={`input-field ${!form.grade_id ? 'bg-gray-50 text-gray-400' : ''}`}
                  value={form.track}
                  onChange={e => setForm({ ...form, track: e.target.value })}
                  disabled={!form.grade_id || selectedLevel === '10'}
                  required={selectedLevel === '11' || selectedLevel === '12'}
                >
                  {selectedLevel === '10' || !selectedLevel ? (
                    <option value="">ទូទៅ (ថ្នាក់ទី១០)</option>
                  ) : (
                    <>
                      <option value="">-- ជ្រើសរើស --</option>
                      <option value="science">វិទ្យាសាស្ត្រពិត</option>
                      <option value="social_science">វិទ្យាសាស្ត្រសង្គម</option>
                    </>
                  )}
                </select>

                {/* Track info hint */}
                {selectedLevel && (
                  <div className={`mt-2 flex items-start gap-2 text-xs rounded-lg px-3 py-2
                    ${selectedLevel === '10'
                      ? 'bg-gray-50 text-gray-500'
                      : 'bg-blue-50 text-blue-600'}`}>
                    <span className="material-icons text-sm flex-shrink-0">info</span>
                    {selectedLevel === '10'
                      ? 'ថ្នាក់ទី១០ ប្រើកម្មវិធីទូទៅ មិនបែងចែកជំនាញ'
                      : 'ថ្នាក់ទី១១-១២ ត្រូវជ្រើសរើសជំនាញ វិទ្យាសាស្ត្រពិត ឬ វិទ្យាសាស្ត្រសង្គម'}
                  </div>
                )}
              </div>

              {/* ឈ្មោះថ្នាក់ */}
              <div>
                <label className="input-label">ឈ្មោះថ្នាក់</label>
                <input className="input-field" placeholder="ឧ: 12A, 11B, 10C"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required />
              </div>

              {/* ចំនួនអតិបរមា */}
              <div>
                <label className="input-label">ចំនួនសិស្សអតិបរមា</label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">
                    groups
                  </span>
                  <input type="number" className="input-field pl-10"
                    min={1} max={60}
                    value={form.max_students}
                    onChange={e => setForm({ ...form, max_students: e.target.value })} />
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
                      <span>{editing ? 'រក្សាទុក' : 'បង្កើតថ្នាក់'}</span>
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

        {/* ── Table ── */}
        <div className="lg:col-span-3 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">list</span>
              <h3 className="font-bold text-gray-800 text-sm">បញ្ជីថ្នាក់រៀន</h3>
            </div>
          </div>
          <div className="px-4 py-3 border-b border-gray-100">
            <select className="input-field py-2 text-sm"
              value={filterYear}
              onChange={e => setFilterYear(e.target.value)}>
              <option value="">ឆ្នាំសិក្សាទាំងអស់</option>
              {years.map(y => (
                <option key={y.id} value={y.id}>{y.name}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">#</th>
                  <th className="table-th">ថ្នាក់</th>
                  <th className="table-th">ថ្នាក់ទី</th>
                  <th className="table-th">កម្មវិធីសិក្សា</th>
                  <th className="table-th">ឆ្នាំ</th>
                  <th className="table-th text-center">អតិបរមា</th>
                  <th className="table-th text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {fetching && (
                  <tr>
                    <td colSpan={7} className="table-td text-center py-10">
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
                {!fetching && classrooms.length === 0 && (
                  <tr>
                    <td colSpan={7} className="table-td text-center py-10">
                      <span className="material-icons text-4xl text-gray-200 block mb-2">
                        meeting_room
                      </span>
                      <p className="text-sm text-gray-400">គ្មានថ្នាក់រៀន</p>
                    </td>
                  </tr>
                )}
                {classrooms.map((c, i) => (
                  <tr key={c.id}
                    className={`table-tr-hover ${editing?.id === c.id ? 'bg-blue-50' : ''}`}>
                    <td className="table-td text-gray-400 text-xs w-8">{i + 1}</td>
                    <td className="table-td">
                      <span className="font-bold text-gray-800 text-base">{c.name}</span>
                    </td>
                    <td className="table-td">
                      <span className="badge badge-blue">{c.grade?.name}</span>
                    </td>
                    <td className="table-td">{trackBadge(c.track)}</td>
                    <td className="table-td text-gray-500 text-xs">{c.academic_year?.name}</td>
                    <td className="table-td text-center">
                      <span className="text-xs font-mono text-gray-600">{c.max_students}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(c)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
                          <span className="material-icons text-base">edit</span>
                        </button>
                        <button onClick={() => handleDelete(c.id)}
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