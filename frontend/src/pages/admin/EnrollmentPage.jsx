import { useEffect, useState } from 'react'
import api from '../../lib/axios'

export default function EnrollmentPage() {
  const [classrooms, setClassrooms] = useState([])
  const [students, setStudents]     = useState([])
  const [selected, setSelected]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [fetching, setFetching]     = useState(false)
  const [success, setSuccess]       = useState('')
  const [error, setError]           = useState('')
  const [form, setForm] = useState({
    student_code: '', name_kh: '', name_en: '',
    date_of_birth: '', gender: 'male',
    guardian_name: '', guardian_phone: '',
    phone: '', address: '', email: '', password: '',
  })

  useEffect(() => {
    api.get('/admin/classrooms').then(r => setClassrooms(r.data))
  }, [])

  const fetchStudents = async (id) => {
    if (!id) return
    setFetching(true)
    try {
      const res = await api.get(`/admin/classrooms/${id}/students`)
      setStudents(res.data)
    } catch (_) {}
    setFetching(false)
  }

  const handleClassroom = (id) => {
    setSelected(id)
    setStudents([])
    if (id) fetchStudents(id)
  }

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  const resetForm = () => {
    setForm({
      student_code: '', name_kh: '', name_en: '',
      date_of_birth: '', gender: 'male',
      guardian_name: '', guardian_phone: '',
      phone: '', address: '', email: '', password: '',
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected) { setError('សូមជ្រើសរើសថ្នាក់ជាមុន'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/admin/enrollment', { ...form, classroom_id: selected })
      showSuccess(`បន្ថែម ${form.name_kh} ជោគជ័យ!`)
      resetForm()
      fetchStudents(selected)
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (studentId, status) => {
    try {
      await api.patch(`/admin/enrollment/${studentId}/status`, {
        classroom_id: selected, status,
      })
      fetchStudents(selected)
    } catch (_) {}
  }

  const statusOptions = [
    { value: 'active',      label: 'សកម្ម',    cls: 'badge-green'  },
    { value: 'transferred', label: 'ផ្ទេរ',     cls: 'badge-yellow' },
    { value: 'dropped',     label: 'ឈប់រៀន',   cls: 'badge-red'    },
    { value: 'graduated',   label: 'បញ្ចប់',    cls: 'badge-blue'   },
  ]

  const selectedRoom = classrooms.find(c => c.id?.toString() === selected)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">ចុះឈ្មោះសិស្ស</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            បន្ថែមសិស្សថ្មី និងគ្រប់គ្រងស្ថានភាព
          </p>
        </div>
        {selectedRoom && (
          <div className="flex items-center gap-2">
            <span className="badge badge-blue">
              <span className="material-icons text-xs">meeting_room</span>
              {selectedRoom.name}
            </span>
            <span className="badge badge-green">
              <span className="material-icons text-xs">groups</span>
              {students.length} នាក់
            </span>
          </div>
        )}
      </div>

      {/* Classroom Selector */}
      <div className="card">
        <div className="card-body">
          <label className="input-label">ជ្រើសរើសថ្នាក់រៀន</label>
          <div className="flex gap-3 items-center">
            <select className="input-field max-w-sm"
              value={selected}
              onChange={e => handleClassroom(e.target.value)}>
              <option value="">-- ជ្រើសរើសថ្នាក់ --</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.grade?.name}
                  {c.track ? ` (${c.track === 'science' ? 'វិទ្យាសាស្ត្រ' : 'សង្គមសាស្ត្រ'})` : ''}
                  — {c.academic_year?.name}
                </option>
              ))}
            </select>
            {selected && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="material-icons text-gray-400 text-base">people</span>
                <span>
                  {students.length} / {selectedRoom?.max_students ?? '?'} នាក់
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-lg px-4 py-3 text-sm">
          <span className="material-icons text-green-500 text-base">check_circle</span>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Form */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-green-600 text-xl">person_add</span>
              <h3 className="font-bold text-gray-800 text-sm">បន្ថែមសិស្សថ្មី</h3>
            </div>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">លេខកូដសិស្ស</label>
                  <input className="input-field font-mono" placeholder="STU-001"
                    value={form.student_code}
                    onChange={e => setForm({ ...form, student_code: e.target.value })}
                    required />
                </div>
                <div>
                  <label className="input-label">ភេទ</label>
                  <select className="input-field"
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}>
                    <option value="male">ប្រុស</option>
                    <option value="female">ស្រី</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">ឈ្មោះជាភាសាខ្មែរ</label>
                <input className="input-field" placeholder="ឧ: ចន្ទ សុភាព"
                  value={form.name_kh}
                  onChange={e => setForm({ ...form, name_kh: e.target.value })}
                  required />
              </div>
              <div>
                <label className="input-label">ឈ្មោះជាភាសាអង់គ្លេស</label>
                <input className="input-field" placeholder="e.g. Chan Sopheak"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })}
                  required />
              </div>
              <div>
                <label className="input-label">ថ្ងៃខែឆ្នាំកំណើត</label>
                <input type="date" className="input-field"
                  value={form.date_of_birth}
                  onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
                  required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">ឈ្មោះអាណាព្យាបាល</label>
                  <input className="input-field" placeholder="ឈ្មោះ"
                    value={form.guardian_name}
                    onChange={e => setForm({ ...form, guardian_name: e.target.value })}
                    required />
                </div>
                <div>
                  <label className="input-label">ទូរស័ព្ទអាណាព្យាបាល</label>
                  <input className="input-field" placeholder="0xx xxx xxx"
                    value={form.guardian_phone}
                    onChange={e => setForm({ ...form, guardian_phone: e.target.value })}
                    required />
                </div>
              </div>
              <div>
                <label className="input-label">
                  អ៊ីមែល
                  <span className="text-gray-400 font-normal ml-1">(ស្រេចចិត្ត)</span>
                </label>
                <input type="email" className="input-field"
                  placeholder="student@school.edu.kh"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              {form.email && (
                <div>
                  <label className="input-label">ពាក្យសម្ងាត់</label>
                  <input type="password" className="input-field"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={loading || !selected}
                  className="btn-primary flex-1">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>កំពុងបន្ថែម...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-lg">person_add</span>
                      <span>ចុះឈ្មោះ</span>
                    </>
                  )}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  <span className="material-icons text-lg">restart_alt</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Student List */}
        <div className="card flex flex-col">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">groups</span>
              <h3 className="font-bold text-gray-800 text-sm">
                បញ្ជីសិស្ស
              </h3>
            </div>
            <span className="badge badge-blue">{students.length} នាក់</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[520px]">
            {!selected && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="material-icons text-5xl mb-3 text-gray-200">
                  meeting_room
                </span>
                <p className="text-sm">សូមជ្រើសរើសថ្នាក់ខាងលើ</p>
              </div>
            )}
            {selected && fetching && (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <span className="text-sm">កំពុងផ្ទុក...</span>
                </div>
              </div>
            )}
            {selected && !fetching && students.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="material-icons text-5xl mb-3 text-gray-200">
                  school
                </span>
                <p className="text-sm">គ្មានសិស្សក្នុងថ្នាក់នេះ</p>
              </div>
            )}
            <div className="divide-y divide-gray-50">
              {students.map((s, i) => (
                <div key={s.id}
                  className="flex items-center gap-3 px-4 py-3
                             hover:bg-gray-50 transition-colors">
                  <span className="text-xs text-gray-400 w-6 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${s.gender === 'female' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                    <span className={`material-icons text-base
                      ${s.gender === 'female' ? 'text-pink-600' : 'text-blue-600'}`}>
                      person
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {s.name_kh}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">{s.student_code}</p>
                  </div>
                  <select
                    defaultValue={s.pivot?.status || 'active'}
                    onChange={e => handleStatus(s.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5
                               bg-white text-gray-700 focus:outline-none
                               focus:ring-1 focus:ring-blue-400 cursor-pointer">
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}