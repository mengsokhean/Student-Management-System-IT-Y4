import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import Breadcrumb    from '../../components/common/Breadcrumb'
import Pagination    from '../../components/common/Pagination'
import Modal         from '../../components/common/Modal'
import RequiredLabel from '../../components/common/RequiredLabel'

function Spinner({ cls = 'h-4 w-4' }) {
  return (
    <svg className={`animate-spin ${cls}`} fill="none" viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

const EMPTY_FORM = {
  teacher_code: '', name_kh: '', name_en: '',
  gender: 'male', phone: '', email: '', password: '',
  date_of_birth: '', address: '',
  degree: '', subject_expertise: '', years_experience: '', employment_date: '',
}

const EXPERTISE_OPTIONS = [
  { val: 'general',        label: 'ទូទៅ (General)',                   icon: 'school'  },
  { val: 'science',        label: 'វិទ្យាសាស្ត្រពិត (Real Science)',  icon: 'science' },
  { val: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម (Social)',      icon: 'public'  },
  { val: 'language',       label: 'ភាសា (Language)',                   icon: 'translate' },
  { val: 'pe',             label: 'អប់រំកាយ (P.E.)',                   icon: 'sports'  },
]

const DEGREE_OPTIONS = [
  'បរិញ្ញាប័ត្រ (Bachelor)',
  'អនុបណ្ឌិត (Master)',
  'បណ្ឌិត (PhD)',
  'គរុកោស (Pedagogy)',
]

export default function TeacherPage() {
  const [teachers,  setTeachers]  = useState([])
  const [fetching,  setFetching]  = useState(true)
  const [search,    setSearch]    = useState('')
  const [filterExpertise, setFilterExpertise] = useState('')
  const [filterGender,    setFilterGender]    = useState('')

  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [modalOpen,    setModalOpen]    = useState(false)
  const [profileTarget,setProfileTarget]= useState(null)
  const [editing,      setEditing]      = useState(null)
  const [form,         setForm]         = useState(EMPTY_FORM)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState('')
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

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 4000) }

  const openCreate = () => {
    setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true)
  }
  const openEdit = (t) => {
    setEditing(t)
    setForm({
      teacher_code:      t.teacher_code,
      name_kh:           t.name_kh,
      name_en:           t.name_en,
      gender:            t.gender,
      phone:             t.phone || '',
      email:             t.user?.email || '',
      password:          '',
      date_of_birth:     t.date_of_birth || '',
      address:           t.address || '',
      degree:            t.degree || '',
      subject_expertise: t.subject_expertise || '',
      years_experience:  t.years_experience || '',
      employment_date:   t.employment_date || '',
    })
    setError(''); setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      if (editing) {
        await api.put(`/admin/teachers/${editing.id}`, form)
        showSuccess('កែប្រែជោគជ័យ!')
      } else {
        await api.post('/admin/teachers', form)
        showSuccess('បន្ថែមគ្រូថ្មីជោគជ័យ!')
      }
      await fetchTeachers(); closeModal()
    } catch (err) { setError(err.response?.data?.message || 'មានបញ្ហា') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await api.delete(`/admin/teachers/${id}`)
      showSuccess('លុបជោគជ័យ!'); setDeleteTarget(null); fetchTeachers()
    } catch (_) {}
    setDeleting(false)
  }

  const filtered = teachers.filter(t => {
    const matchSearch = !search ||
      t.name_kh.includes(search) ||
      t.name_en.toLowerCase().includes(search.toLowerCase()) ||
      t.teacher_code.toLowerCase().includes(search.toLowerCase())
    const matchExp    = !filterExpertise || t.subject_expertise === filterExpertise
    const matchGender = !filterGender    || t.gender === filterGender
    return matchSearch && matchExp && matchGender
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  const maleCount   = teachers.filter(t => t.gender === 'male').length
  const femaleCount = teachers.filter(t => t.gender === 'female').length
  const homeroomCount = teachers.filter(t => t.homeroom_classroom).length

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'             },
        { label: 'គ្រប់គ្រង', path: '#'                                           },
        { label: 'បញ្ជីគ្រូបង្រៀន' },
      ]} />

      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200
                        text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <span className="material-icons text-green-500 text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: 'supervisor_account', bg: 'bg-blue-600',   label: 'គ្រូសរុប',          value: teachers.length },
          { icon: 'home',               bg: 'bg-green-600',  label: 'Homeroom Teacher',    value: homeroomCount   },
          { icon: 'male',               bg: 'bg-sky-600',    label: 'ប្រុស',               value: maleCount       },
          { icon: 'female',             bg: 'bg-pink-500',   label: 'ស្រី',                value: femaleCount     },
        ].map((s, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center
                            justify-center flex-shrink-0 shadow-sm`}>
              <span className="material-icons text-white text-xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងគ្រូបង្រៀន</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            ព័ត៌មានគ្រូ · ជំនាញ · ការចាត់តាំង
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <span className="material-icons text-lg">person_add</span>
          <span>បន្ថែមគ្រូថ្មី</span>
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100
                        flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                                text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                w-60 bg-white"
                placeholder="ស្វែងរកតាមឈ្មោះ ឬ ID..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <select value={filterExpertise}
              onChange={e => { setFilterExpertise(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ជំនាញទាំងអស់</option>
              {EXPERTISE_OPTIONS.map(o => (
                <option key={o.val} value={o.val}>{o.label}</option>
              ))}
            </select>
            <select value={filterGender}
              onChange={e => { setFilterGender(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ភេទទាំងអស់</option>
              <option value="male">ប្រុស</option>
              <option value="female">ស្រី</option>
            </select>
          </div>
          <span className="badge badge-purple">
            <span className="material-icons text-xs">supervisor_account</span>
            {filtered.length} នាក់
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">គ្រូ</th>
                <th className="table-th">លេខ ID</th>
                <th className="table-th">ភេទ</th>
                <th className="table-th">ទូរស័ព្ទ</th>
                <th className="table-th">ជំនាញ</th>
                <th className="table-th">វិញ្ញាបនប័ត្រ</th>
                <th className="table-th">Homeroom</th>
                <th className="table-th text-center">ស្ថានភាព</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={10} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr><td colSpan={10} className="py-16 text-center">
                  <span className="material-icons text-5xl text-gray-200 block mb-3">
                    supervisor_account
                  </span>
                  <p className="text-gray-400 text-sm">
                    {search ? 'រកមិនឃើញ' : 'គ្មានគ្រូ'}
                  </p>
                </td></tr>
              )}
              {paginated.map((t, i) => {
                const expertise    = EXPERTISE_OPTIONS.find(e => e.val === t.subject_expertise)
                const homeroomRoom = t.homeroom_classroom?.classroom
                return (
                  <tr key={t.id} className="table-tr-hover">
                    <td className="table-td text-gray-400 text-xs">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center
                                        justify-center flex-shrink-0 font-bold text-sm
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
                    <td className="table-td">
                      {expertise ? (
                        <span className={`badge
                          ${expertise.val === 'science'        ? 'badge-blue'   :
                            expertise.val === 'social_science' ? 'badge-purple' :
                            expertise.val === 'language'       ? 'badge-yellow' :
                            'badge-gray'}`}>
                          <span className="material-icons text-xs">{expertise.icon}</span>
                          {expertise.label.split(' ')[0]}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="table-td text-sm text-gray-500">
                      {t.degree || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="table-td">
                      {homeroomRoom ? (
                        <div className="flex items-center gap-1.5">
                          <span className="material-icons text-green-500 text-base">home</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {homeroomRoom.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="table-td text-center">
                      <span className="badge badge-green">
                        <span className="material-icons text-xs">check_circle</span>
                        សកម្ម
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setProfileTarget(t)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                          title="មើល Profile">
                          <span className="material-icons text-base">person</span>
                        </button>
                        <button onClick={() => openEdit(t)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          title="កែប្រែ">
                          <span className="material-icons text-base">edit</span>
                        </button>
                        <button onClick={() => setDeleteTarget(t)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                          title="លុប">
                          <span className="material-icons text-base">delete_outline</span>
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
          currentPage={page} totalPages={totalPages} perPage={perPage}
          total={filtered.length} onPageChange={setPage}
          onPerPageChange={n => { setPerPage(n); setPage(1) }}
        />
      </div>

      {/* ══ Teacher Profile Modal ══ */}
      <Modal open={!!profileTarget} onClose={() => setProfileTarget(null)}
        title="ប្រវត្តិរូបគ្រូ" icon="person" size="lg">
        {profileTarget && (() => {
          const t           = profileTarget
          const expertise   = EXPERTISE_OPTIONS.find(e => e.val === t.subject_expertise)
          const homeroomRoom= t.homeroom_classroom?.classroom
          return (
            <div className="space-y-5">
              {/* Hero */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r
                              from-blue-700 to-blue-600 rounded-xl text-white">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
                                flex-shrink-0 font-bold text-2xl shadow-md
                  ${t.gender === 'female' ? 'bg-pink-200 text-pink-700' : 'bg-blue-200 text-blue-700'}`}>
                  {t.name_kh.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl">{t.name_kh}</p>
                  <p className="text-blue-200 text-sm">{t.name_en}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-white bg-opacity-20 px-2.5 py-1 rounded-lg font-mono">
                      {t.teacher_code}
                    </span>
                    {expertise && (
                      <span className="text-xs bg-white bg-opacity-20 px-2.5 py-1 rounded-lg
                                       flex items-center gap-1">
                        <span className="material-icons text-xs">{expertise.icon}</span>
                        {expertise.label.split('(')[0].trim()}
                      </span>
                    )}
                  </div>
                </div>
                {homeroomRoom && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-blue-200 text-xs">Homeroom</p>
                    <p className="font-bold text-lg">{homeroomRoom.name}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Personal */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3
                                 flex items-center gap-1.5">
                    <span className="material-icons text-sm">person</span>
                    ព័ត៌មានផ្ទាល់ខ្លួន
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: 'badge',           label: 'ID',              val: t.teacher_code                         },
                      { icon: 'translate',       label: 'ឈ្មោះអង់',       val: t.name_en                              },
                      { icon: t.gender === 'female' ? 'female' : 'male',
                        label: 'ភេទ', val: t.gender === 'female' ? 'ស្រី' : 'ប្រុស' },
                      { icon: 'phone',           label: 'ទូរស័ព្ទ',        val: t.phone || '—'                         },
                      { icon: 'alternate_email', label: 'អ៊ីមែល',          val: t.user?.email || '—'                   },
                      { icon: 'cake',            label: 'ថ្ងៃកំណើត',       val: t.date_of_birth || '—'                 },
                      { icon: 'location_on',     label: 'អាសយដ្ឋាន',      val: t.address || '—'                       },
                    ].map(item => (
                      <div key={item.label}
                        className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
                        <div className="w-7 h-7 bg-white rounded-md flex items-center
                                        justify-center flex-shrink-0 shadow-sm">
                          <span className="material-icons text-blue-600 text-sm">{item.icon}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="text-xs text-gray-400">{item.label}</span>
                          <span className="text-xs font-semibold text-gray-800 truncate ml-2">
                            {item.val}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3
                                 flex items-center gap-1.5">
                    <span className="material-icons text-sm">work</span>
                    ព័ត៌មានវិជ្ជាជីវៈ
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: 'school',        label: 'វិញ្ញាបនប័ត្រ',   val: t.degree || '—'                        },
                      { icon: 'science',       label: 'ជំនាញ',            val: expertise?.label || '—'               },
                      { icon: 'history',       label: 'បទពិសោធ',         val: t.years_experience ? `${t.years_experience} ឆ្នាំ` : '—' },
                      { icon: 'calendar_today',label: 'ចូលបម្រើ',         val: t.employment_date || '—'              },
                      { icon: 'home',          label: 'Homeroom',         val: homeroomRoom?.name || 'មិនទាន់ចាត់'   },
                      { icon: 'menu_book',     label: 'មុខវិជ្ជាបង្រៀន', val: '—'                                   },
                      { icon: 'meeting_room',  label: 'ថ្នាក់',            val: '—'                                   },
                    ].map(item => (
                      <div key={item.label}
                        className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
                        <div className="w-7 h-7 bg-white rounded-md flex items-center
                                        justify-center flex-shrink-0 shadow-sm">
                          <span className="material-icons text-purple-600 text-sm">{item.icon}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="text-xs text-gray-400">{item.label}</span>
                          <span className="text-xs font-semibold text-gray-800 truncate ml-2">
                            {item.val}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setProfileTarget(null); openEdit(t) }}
                  className="btn-secondary flex-1">
                  <span className="material-icons text-lg">edit</span>
                  <span>កែប្រែ</span>
                </button>
                <button onClick={() => setProfileTarget(null)} className="btn-primary flex-1">
                  <span className="material-icons text-lg">close</span>
                  <span>បិទ</span>
                </button>
              </div>
            </div>
          )
        })()}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal}
        title={editing ? 'កែប្រែព័ត៌មានគ្រូ' : 'បន្ថែមគ្រូបង្រៀនថ្មី'}
        icon={editing ? 'edit' : 'person_add'} size="xl">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-700 rounded-lg px-3 py-2.5 mb-5 text-sm">
            <span className="material-icons text-red-500 text-base">error_outline</span>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>

          {/* Section: Personal */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-blue-600 text-lg">person</span>
              <p className="font-bold text-gray-700 text-sm">ព័ត៌មានផ្ទាល់ខ្លួន</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <RequiredLabel>លេខ ID គ្រូ</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">badge</span>
                  <input className="input-field pl-10 font-mono" placeholder="TCH-001"
                    value={form.teacher_code}
                    onChange={e => setForm({ ...form, teacher_code: e.target.value })}
                    required={!editing} disabled={!!editing} />
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
                        value={opt.val} checked={form.gender === opt.val}
                        onChange={() => setForm({ ...form, gender: opt.val })} />
                      <span className={`material-icons text-lg
                        ${form.gender === opt.val ? 'text-blue-600' : 'text-gray-400'}`}>
                        {opt.icon}
                      </span>
                      <span className={`font-semibold text-sm
                        ${form.gender === opt.val ? 'text-blue-700' : 'text-gray-500'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <RequiredLabel optional>ថ្ងៃខែឆ្នាំ</RequiredLabel>
                <input type="date" className="input-field"
                  value={form.date_of_birth}
                  onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
              </div>
              <div>
                <RequiredLabel>ឈ្មោះជាខ្មែរ</RequiredLabel>
                <input className="input-field" placeholder="ឧ: ចន្ទ សុភាព"
                  value={form.name_kh}
                  onChange={e => setForm({ ...form, name_kh: e.target.value })} required />
              </div>
              <div>
                <RequiredLabel>ឈ្មោះជាអង់គ្លេស</RequiredLabel>
                <input className="input-field" placeholder="e.g. Chan Sopheak"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })} required />
              </div>
              <div>
                <RequiredLabel optional>ទូរស័ព្ទ</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">phone</span>
                  <input className="input-field pl-10" placeholder="0xx xxx xxx"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Professional */}
          <div className="border-t border-gray-100 pt-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-purple-600 text-lg">work</span>
              <p className="font-bold text-gray-700 text-sm">ព័ត៌មានវិជ្ជាជីវៈ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <RequiredLabel optional>ជំនាញ / Track Expertise</RequiredLabel>
                <select className="input-field"
                  value={form.subject_expertise}
                  onChange={e => setForm({ ...form, subject_expertise: e.target.value })}>
                  <option value="">-- ជ្រើស --</option>
                  {EXPERTISE_OPTIONS.map(o => (
                    <option key={o.val} value={o.val}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <RequiredLabel optional>វិញ្ញាបនប័ត្រ</RequiredLabel>
                <select className="input-field"
                  value={form.degree}
                  onChange={e => setForm({ ...form, degree: e.target.value })}>
                  <option value="">-- ជ្រើស --</option>
                  {DEGREE_OPTIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <RequiredLabel optional>បទពិសោធ (ឆ្នាំ)</RequiredLabel>
                <input type="number" className="input-field" min={0} max={40}
                  placeholder="ឧ: 5"
                  value={form.years_experience}
                  onChange={e => setForm({ ...form, years_experience: e.target.value })} />
              </div>
              <div>
                <RequiredLabel optional>ថ្ងៃចូលបម្រើ</RequiredLabel>
                <input type="date" className="input-field"
                  value={form.employment_date}
                  onChange={e => setForm({ ...form, employment_date: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Section: Account */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-gray-500 text-lg">lock</span>
              <p className="font-bold text-gray-700 text-sm">គណនីចូលប្រព័ន្ធ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <RequiredLabel>{editing ? 'អ៊ីមែល (ថេរ)' : 'អ៊ីមែល'}</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">
                    alternate_email
                  </span>
                  <input type="email" className="input-field pl-10"
                    placeholder="example@school.edu.kh"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required={!editing} disabled={!!editing} />
                </div>
              </div>
              <div>
                <RequiredLabel optional={!!editing}>
                  {editing ? 'ពាក្យសម្ងាត់ថ្មី (ទុកទទេបើមិនផ្លាស់ប្ដូរ)' : 'ពាក្យសម្ងាត់'}
                </RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">lock_outline</span>
                  <input type="password" className="input-field pl-10"
                    placeholder={editing ? '••••••••' : 'យ៉ាងហោចណាស់ ៦ ខ្ទង់'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required={!editing} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span><span>បោះបង់</span>
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <><Spinner /><span>រក្សាទុក...</span></> :
                <><span className="material-icons text-lg">save</span>
                  <span>{editing ? 'រក្សាទុក' : 'បន្ថែមគ្រូ'}</span></>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="លុបគ្រូ" icon="warning_amber" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <span className="material-icons text-red-500 text-3xl">person_remove</span>
          </div>
          <p className="font-bold text-gray-800 text-lg mb-2">
            លុបគ្រូ "{deleteTarget?.name_kh}"?
          </p>
          <p className="text-gray-500 text-sm mb-6">
            ការចាត់តាំង Homeroom និងមុខវិជ្ជាទាំងអស់
            នឹងត្រូវលុបចោល
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span><span>បោះបង់</span>
            </button>
            <button onClick={() => handleDelete(deleteTarget?.id)}
              disabled={deleting} className="btn-danger flex-1">
              {deleting ? <><Spinner /><span>លុប...</span></> :
                <><span className="material-icons text-lg">delete_forever</span>
                  <span>បញ្ជាក់</span></>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}