import { useEffect, useState } from 'react'
import api from '../../lib/axios'

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

export default function AssignmentPage() {
  const [tab, setTab] = useState('homeroom')

  const tabs = [
    { key: 'homeroom', icon: 'home',       label: 'ចាត់តាំង Homeroom'  },
    { key: 'subject',  icon: 'menu_book',  label: 'ចាត់តាំងមុខវិជ្ជា'  },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-800">ចាត់តាំងគ្រូបង្រៀន</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          ចាត់តាំង Homeroom Teacher និងគ្រូបង្រៀនមុខវិជ្ជា
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                        font-semibold transition-all duration-200
                        ${tab === t.key
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'}`}>
            <span className="material-icons text-base">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'homeroom' ? <HomeroomTab /> : <SubjectTab />}
    </div>
  )
}

/* ══════════════════════════════════════════
   HOMEROOM TAB
══════════════════════════════════════════ */
function HomeroomTab() {
  const [classrooms, setClassrooms] = useState([])
  const [teachers,   setTeachers]   = useState([])
  const [form, setForm]             = useState({ classroom_id: '', teacher_profile_id: '' })
  const [loading,  setLoading]      = useState(false)
  const [fetching, setFetching]     = useState(true)
  const [success,  setSuccess]      = useState('')
  const [error,    setError]        = useState('')

  const fetchAll = async () => {
    setFetching(true)
    try {
      const [cr, tr] = await Promise.all([
        api.get('/admin/classrooms'),
        api.get('/admin/teachers'),
      ])
      setClassrooms(cr.data)
      setTeachers(tr.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchAll() }, [])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/admin/teachers/assign-homeroom', form)
      showSuccess('ចាត់តាំង Homeroom Teacher ជោគជ័យ!')
      setForm({ classroom_id: '', teacher_profile_id: '' })
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  // Group classrooms with their homeroom teacher
  const classroomsWithHomeroom = classrooms.map(c => ({
    ...c,
    homeroom: c.homeroom_teacher || null,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

      {/* Form */}
      <div className="lg:col-span-2 card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <span className="material-icons text-blue-600 text-xl">person_add</span>
            <h3 className="font-bold text-gray-800 text-sm">ចាត់តាំង Homeroom</h3>
          </div>
        </div>
        <div className="card-body space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200
                            text-red-700 rounded-lg px-3 py-2.5 text-sm">
              <span className="material-icons text-red-500 text-base">error_outline</span>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200
                            text-green-700 rounded-lg px-3 py-2.5 text-sm">
              <span className="material-icons text-green-500 text-base">check_circle</span>
              {success}
            </div>
          )}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3
                          flex items-start gap-2">
            <span className="material-icons text-blue-500 text-base flex-shrink-0 mt-0.5">
              info
            </span>
            <p className="text-xs text-blue-600 leading-relaxed">
              ថ្នាក់នីមួយៗមាន Homeroom Teacher ម្នាក់ប៉ុណ្ណោះ។
              ការចាត់តាំងថ្មីនឹងជំនួសចាស់ដោយស្វ័យប្រវត្តិ
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">ថ្នាក់រៀន</label>
              <select className="input-field"
                value={form.classroom_id}
                onChange={e => setForm({ ...form, classroom_id: e.target.value })}
                required>
                <option value="">-- ជ្រើសថ្នាក់ --</option>
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.grade?.name}
                    {c.track ? ` (${c.track === 'science' ? 'វិទ្យាសាស្ត្រពិត' : 'វិទ្យាសាស្ត្រសង្គម'})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">គ្រូ Homeroom</label>
              <select className="input-field"
                value={form.teacher_profile_id}
                onChange={e => setForm({ ...form, teacher_profile_id: e.target.value })}
                required>
                <option value="">-- ជ្រើសគ្រូ --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name_kh} ({t.teacher_code})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? <><Spinner /><span>កំពុងចាត់តាំង...</span></>
                : <><span className="material-icons text-lg">assignment_ind</span>
                   <span>ចាត់តាំង Homeroom</span></>
              }
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="lg:col-span-3 card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <span className="material-icons text-blue-600 text-xl">list</span>
            <h3 className="font-bold text-gray-800 text-sm">ថ្នាក់ + Homeroom Teacher</h3>
          </div>
          <span className="badge badge-blue">{classrooms.length} ថ្នាក់</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">#</th>
                <th className="table-th">ថ្នាក់</th>
                <th className="table-th">ថ្នាក់ទី</th>
                <th className="table-th">ជំនាញ</th>
                <th className="table-th">Homeroom Teacher</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={5} className="table-td text-center py-10">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner /><span className="text-sm">កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && classrooms.length === 0 && (
                <tr><td colSpan={5} className="table-td text-center py-10">
                  <span className="material-icons text-4xl text-gray-200 block mb-2">
                    meeting_room
                  </span>
                  <p className="text-sm text-gray-400">គ្មានថ្នាក់រៀន</p>
                </td></tr>
              )}
              {classrooms.map((c, i) => (
                <tr key={c.id} className="table-tr-hover">
                  <td className="table-td text-gray-400 text-xs w-8">{i + 1}</td>
                  <td className="table-td font-bold text-gray-800">{c.name}</td>
                  <td className="table-td">
                    <span className="badge badge-blue">{c.grade?.name}</span>
                  </td>
                  <td className="table-td">
                    {c.track === 'science'
                      ? <span className="badge badge-green">
                          <span className="material-icons text-xs">science</span>
                          វិទ្យាសាស្ត្រពិត
                        </span>
                      : c.track === 'social_science'
                      ? <span className="badge badge-purple">
                          <span className="material-icons text-xs">public</span>
                          វិទ្យាសាស្ត្រសង្គម
                        </span>
                      : <span className="badge badge-gray">ទូទៅ</span>
                    }
                  </td>
                  <td className="table-td">
                    {c.homeroom_teacher?.teacher_profile ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center
                                        justify-center flex-shrink-0">
                          <span className="material-icons text-blue-600 text-sm">person</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {c.homeroom_teacher.teacher_profile.name_kh}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {c.homeroom_teacher.teacher_profile.teacher_code}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600
                                       bg-amber-50 border border-amber-200 rounded-lg
                                       px-2.5 py-1 w-fit">
                        <span className="material-icons text-sm">warning_amber</span>
                        មិនទាន់ចាត់តាំង
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   SUBJECT ASSIGNMENT TAB
══════════════════════════════════════════ */
function SubjectTab() {
  const [classrooms, setClassrooms] = useState([])
  const [teachers,   setTeachers]   = useState([])
  const [subjects,   setSubjects]   = useState([])
  const [selected,   setSelected]   = useState('')
  const [assignments, setAssignments] = useState([])
  const [form, setForm] = useState({ teacher_profile_id: '', subject_id: '' })
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  const fetchBase = async () => {
    try {
      const [cr, tr, su] = await Promise.all([
        api.get('/admin/classrooms'),
        api.get('/admin/teachers'),
        api.get('/admin/subjects'),
      ])
      setClassrooms(cr.data)
      setTeachers(tr.data)
      setSubjects(su.data)
    } catch (_) {}
    setFetching(false)
  }

  useEffect(() => { fetchBase() }, [])

  const fetchAssignments = async (id) => {
    if (!id) return
    try {
      const res = await api.get(`/admin/classrooms/${id}`)
      setAssignments(res.data.teacher_class_subjects || [])
    } catch (_) {}
  }

  const handleClassroom = (id) => {
    setSelected(id)
    setAssignments([])
    setForm({ teacher_profile_id: '', subject_id: '' })
    if (id) fetchAssignments(id)
  }

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    setError('')
    try {
      await api.post('/admin/teachers/assign-subject', {
        ...form,
        classroom_id: selected,
      })
      showSuccess('ចាត់តាំងមុខវិជ្ជាជោគជ័យ!')
      setForm({ teacher_profile_id: '', subject_id: '' })
      fetchAssignments(selected)
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (classroomId, subjectId) => {
    if (!window.confirm('តើអ្នកចង់លុបការចាត់តាំងនេះមែនទេ?')) return
    try {
      await api.post('/admin/teachers/remove-subject', {
        classroom_id: classroomId,
        subject_id:   subjectId,
      })
      showSuccess('លុបការចាត់តាំងជោគជ័យ!')
      fetchAssignments(classroomId)
    } catch (_) {}
  }

  const selectedRoom = classrooms.find(c => c.id?.toString() === selected)

  return (
    <div className="space-y-5">

      {/* Classroom Selector */}
      <div className="card">
        <div className="card-body">
          <label className="input-label">ជ្រើសថ្នាក់រៀន</label>
          <select className="input-field max-w-sm"
            value={selected}
            onChange={e => handleClassroom(e.target.value)}>
            <option value="">-- ជ្រើសថ្នាក់ --</option>
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.grade?.name} ({c.academic_year?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-lg px-4 py-3 text-sm">
          <span className="material-icons text-green-500 text-base">check_circle</span>
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Assign Form */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-green-600 text-xl">add_circle</span>
              <h3 className="font-bold text-gray-800 text-sm">ចាត់តាំងគ្រូបង្រៀនមុខវិជ្ជា</h3>
            </div>
          </div>
          <div className="card-body">
            {!selected ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <span className="material-icons text-4xl mb-2 text-gray-200">
                  meeting_room
                </span>
                <p className="text-sm">សូមជ្រើសថ្នាក់ជាមុន</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200
                                  text-red-700 rounded-lg px-3 py-2.5 mb-4 text-sm">
                    <span className="material-icons text-red-500 text-base">error_outline</span>
                    {error}
                  </div>
                )}
                {selectedRoom && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs text-blue-600 font-semibold">ថ្នាក់ដែលបានជ្រើស</p>
                    <p className="text-sm font-bold text-blue-800 mt-0.5">
                      {selectedRoom.name} — {selectedRoom.grade?.name}
                    </p>
                  </div>
                )}
                <form onSubmit={handleAssign} className="space-y-4">
                  <div>
                    <label className="input-label">គ្រូបង្រៀន</label>
                    <select className="input-field"
                      value={form.teacher_profile_id}
                      onChange={e => setForm({ ...form, teacher_profile_id: e.target.value })}
                      required>
                      <option value="">-- ជ្រើសគ្រូ --</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name_kh} ({t.teacher_code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">មុខវិជ្ជា</label>
                    <select className="input-field"
                      value={form.subject_id}
                      onChange={e => setForm({ ...form, subject_id: e.target.value })}
                      required>
                      <option value="">-- ជ្រើសមុខវិជ្ជា --</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name_kh} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading
                      ? <><Spinner /><span>កំពុងចាត់តាំង...</span></>
                      : <><span className="material-icons text-lg">assignment</span>
                         <span>ចាត់តាំង</span></>
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Assignments Table */}
        <div className="lg:col-span-3 card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-purple-600 text-xl">assignment</span>
              <h3 className="font-bold text-gray-800 text-sm">
                ការចាត់តាំង
                {selectedRoom && (
                  <span className="text-gray-400 font-normal ml-1">— {selectedRoom.name}</span>
                )}
              </h3>
            </div>
            <span className="badge badge-purple">{assignments.length} មុខវិជ្ជា</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">#</th>
                  <th className="table-th">មុខវិជ្ជា</th>
                  <th className="table-th">គ្រូបង្រៀន</th>
                  <th className="table-th text-center">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {!selected && (
                  <tr><td colSpan={4} className="table-td text-center py-12">
                    <span className="material-icons text-5xl text-gray-200 block mb-2">
                      meeting_room
                    </span>
                    <p className="text-sm text-gray-400">សូមជ្រើសថ្នាក់</p>
                  </td></tr>
                )}
                {selected && assignments.length === 0 && (
                  <tr><td colSpan={4} className="table-td text-center py-12">
                    <span className="material-icons text-5xl text-gray-200 block mb-2">
                      menu_book
                    </span>
                    <p className="text-sm text-gray-400">
                      មិនទាន់មានការចាត់តាំងមុខវិជ្ជា
                    </p>
                  </td></tr>
                )}
                {assignments.map((a, i) => (
                  <tr key={a.id} className="table-tr-hover">
                    <td className="table-td text-gray-400 text-xs w-8">{i + 1}</td>
                    <td className="table-td">
                      <p className="font-semibold text-gray-800 text-sm">
                        {a.subject?.name_kh}
                      </p>
                      <span className="badge badge-blue font-mono text-xs">
                        {a.subject?.code}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-purple-100 rounded-md flex items-center
                                        justify-center flex-shrink-0">
                          <span className="material-icons text-purple-600 text-sm">person</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {a.teacher_profile?.name_kh}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {a.teacher_profile?.teacher_code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td text-center">
                      <button
                        onClick={() => handleRemove(selected, a.subject_id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg
                                   bg-red-50 hover:bg-red-100 text-red-500 transition-colors
                                   mx-auto">
                        <span className="material-icons text-base">delete_outline</span>
                      </button>
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