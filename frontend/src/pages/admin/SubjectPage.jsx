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

// Cambodia Curriculum Definition
const CURRICULUM = {
  grade10: {
    label: 'ថ្នាក់ទី១០ — ទូទៅ',
    track: 'general',
    color: { bg: 'bg-gray-600', light: 'bg-gray-50 border-gray-200', text: 'text-gray-700', badge: 'badge-gray' },
    subjects: [
      { code: 'KH',     name_kh: 'ភាសាខ្មែរ',      name_en: 'Khmer Language',    hours: 5, semester: '1,2' },
      { code: 'EN',     name_kh: 'ភាសាអង់គ្លេស',    name_en: 'English',            hours: 5, semester: '1,2' },
      { code: 'MATH',   name_kh: 'គណិតវិទ្យា',      name_en: 'Mathematics',        hours: 4, semester: '1,2' },
      { code: 'HIST',   name_kh: 'ប្រវត្តិវិទ្យា',  name_en: 'History',            hours: 2, semester: '1,2' },
      { code: 'GEO',    name_kh: 'ភូមិវិទ្យា',      name_en: 'Geography',          hours: 2, semester: '1,2' },
      { code: 'CIVIC',  name_kh: 'ពលរដ្ឋវិទ្យា',   name_en: 'Civic Education',    hours: 2, semester: '1,2' },
      { code: 'ETHICS', name_kh: 'សីលធម៌',          name_en: 'Ethics & Morality',  hours: 1, semester: '1,2' },
      { code: 'PE',     name_kh: 'អប់រំកាយ',        name_en: 'Physical Education', hours: 2, semester: '1,2' },
    ],
  },
  grade11_12_science: {
    label: 'ថ្នាក់ទី១១-១២ — វិទ្យាសាស្ត្រពិត',
    track: 'science',
    color: { bg: 'bg-blue-600', light: 'bg-blue-50 border-blue-200', text: 'text-blue-700', badge: 'badge-blue' },
    subjects: [
      { code: 'PHY',   name_kh: 'រូបវិទ្យា',          name_en: 'Physics',              hours: 4, semester: '1,2' },
      { code: 'CHEM',  name_kh: 'គីមីវិទ្យា',         name_en: 'Chemistry',            hours: 4, semester: '1,2' },
      { code: 'BIO',   name_kh: 'ជីវវិទ្យា',           name_en: 'Biology',              hours: 3, semester: '1,2' },
      { code: 'AMATH', name_kh: 'គណិតវិទ្យាជ្រៅ',    name_en: 'Advanced Mathematics', hours: 5, semester: '1,2' },
    ],
  },
  grade11_12_social: {
    label: 'ថ្នាក់ទី១១-១២ — វិទ្យាសាស្ត្រសង្គម',
    track: 'social_science',
    color: { bg: 'bg-purple-600', light: 'bg-purple-50 border-purple-200', text: 'text-purple-700', badge: 'badge-purple' },
    subjects: [
      { code: 'HIST2', name_kh: 'ប្រវត្តិវិទ្យា',    name_en: 'History',           hours: 3, semester: '1,2' },
      { code: 'GEO2',  name_kh: 'ភូមិវិទ្យា',        name_en: 'Geography',         hours: 3, semester: '1,2' },
      { code: 'ECON',  name_kh: 'សេដ្ឋកិច្ច',        name_en: 'Economics',         hours: 3, semester: '1,2' },
      { code: 'CIVIC2',name_kh: 'ពលរដ្ឋវិទ្យា',     name_en: 'Civic Education',   hours: 2, semester: '1,2' },
    ],
  },
}

const ALL_PREDEFINED = [
  ...CURRICULUM.grade10.subjects.map(s => ({ ...s, track: 'general' })),
  ...CURRICULUM.grade11_12_science.subjects.map(s => ({ ...s, track: 'science' })),
  ...CURRICULUM.grade11_12_social.subjects.map(s => ({ ...s, track: 'social_science' })),
]

const TRACK_CFG = {
  general:        { label: 'ទូទៅ',             icon: 'school',  cls: 'badge-gray',   bg: 'bg-gray-500',   light: 'bg-gray-50'   },
  science:        { label: 'វិទ្យាសាស្ត្រពិត', icon: 'science', cls: 'badge-blue',   bg: 'bg-blue-600',   light: 'bg-blue-50'   },
  social_science: { label: 'វិទ្យាសាស្ត្រសង្គម',icon: 'public',  cls: 'badge-purple', bg: 'bg-purple-600', light: 'bg-purple-50' },
}

const guessTrack = (code) => {
  if (CURRICULUM.grade11_12_science.subjects.find(s => s.code === code)) return 'science'
  if (CURRICULUM.grade11_12_social.subjects.find(s => s.code === code))  return 'social_science'
  return 'general'
}

const getPredefined = (code) => ALL_PREDEFINED.find(s => s.code === code)

const EMPTY_FORM = { name_kh: '', name_en: '', code: '', hours: 3 }

export default function SubjectPage() {
  const [subjects,     setSubjects]     = useState([])
  const [fetching,     setFetching]     = useState(true)
  const [search,       setSearch]       = useState('')
  const [filterTrack,  setFilterTrack]  = useState('')

  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(15)

  const [modalOpen,    setModalOpen]    = useState(false)
  const [detailTarget, setDetailTarget] = useState(null)
  const [editing,      setEditing]      = useState(null)
  const [form,         setForm]         = useState(EMPTY_FORM)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState('')
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

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 4000) }

  const openCreate = () => {
    setEditing(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true)
  }
  const openEdit = (s) => {
    setEditing(s)
    setForm({ name_kh: s.name_kh, name_en: s.name_en, code: s.code,
              hours: getPredefined(s.code)?.hours || 3 })
    setError(''); setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false); setEditing(null); setForm(EMPTY_FORM); setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      if (editing) {
        await api.put(`/admin/subjects/${editing.id}`, form)
        showSuccess('កែប្រែជោគជ័យ!')
      } else {
        await api.post('/admin/subjects', form)
        showSuccess('បន្ថែមជោគជ័យ!')
      }
      await fetchSubjects(); closeModal()
    } catch (err) { setError(err.response?.data?.message || 'មានបញ្ហា') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await api.delete(`/admin/subjects/${id}`)
      showSuccess('លុបជោគជ័យ!'); setDeleteTarget(null); fetchSubjects()
    } catch (_) {}
    setDeleting(false)
  }

  const filtered = subjects.filter(s => {
    const track = guessTrack(s.code)
    const matchSearch = !search ||
      s.name_kh.includes(search) ||
      s.name_en.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
    const matchTrack = !filterTrack || track === filterTrack
    return matchSearch && matchTrack
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  const genCount    = subjects.filter(s => guessTrack(s.code) === 'general').length
  const sciCount    = subjects.filter(s => guessTrack(s.code) === 'science').length
  const socialCount = subjects.filter(s => guessTrack(s.code) === 'social_science').length
  const activeCount = subjects.length // all active by default

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

      {/* Stats — only 2 meaningful cards + breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: 'menu_book',  bg: 'bg-blue-600',   label: 'មុខវិជ្ជាសរុប',    value: subjects.length  },
          { icon: 'check_circle', bg: 'bg-green-600', label: 'មុខវិជ្ជាសកម្ម',   value: activeCount     },
          { icon: 'school',     bg: 'bg-gray-500',   label: 'ទូទៅ (Grade 10)',    value: genCount        },
          { icon: 'science',    bg: 'bg-blue-500',   label: 'វិទ្យាសាស្ត្រ',      value: sciCount + socialCount },
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

      {/* Cambodia Curriculum Panel */}
      <div className="card overflow-hidden">
        <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <span className="material-icons text-blue-300 text-lg">auto_stories</span>
            កម្មវិធីសិក្សាវិទ្យាល័យកម្ពុជា — Cambodia High School Curriculum
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0
                        md:divide-x divide-gray-100">
          {Object.entries(CURRICULUM).map(([key, cur]) => (
            <div key={key} className="p-4">
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b
                               border-gray-100`}>
                <div className={`w-8 h-8 ${cur.color.bg} rounded-lg flex items-center
                                justify-center flex-shrink-0`}>
                  <span className="material-icons text-white text-base">
                    {cur.track === 'general' ? 'school' :
                     cur.track === 'science' ? 'science' : 'public'}
                  </span>
                </div>
                <div>
                  <p className={`font-bold text-xs ${cur.color.text}`}>{cur.label}</p>
                  <p className="text-xs text-gray-400">
                    {cur.subjects.length} មុខវិជ្ជា
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                {cur.subjects.map(s => (
                  <div key={s.code}
                    className="flex items-center justify-between text-xs py-1
                               border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded
                        ${cur.track === 'general'        ? 'bg-gray-100 text-gray-600'   :
                          cur.track === 'science'        ? 'bg-blue-100 text-blue-700'   :
                          'bg-purple-100 text-purple-700'}`}>
                        {s.code}
                      </span>
                      <span className="text-gray-700">{s.name_kh}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="material-icons text-xs">schedule</span>
                      <span>{s.hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងមុខវិជ្ជា</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            ទូទៅ · វិទ្យាសាស្ត្រពិត · វិទ្យាសាស្ត្រសង្គម
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <span className="material-icons text-lg">add_circle</span>
          <span>បន្ថែមមុខវិជ្ជា</span>
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
                                w-56 bg-white"
                placeholder="ស្វែងរកតាមឈ្មោះ ឬ Code..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { val: '',               label: 'ទាំងអស់'             },
                { val: 'general',        label: 'ទូទៅ'                },
                { val: 'science',        label: 'វិទ្យាសាស្ត្រពិត'    },
                { val: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម' },
              ].map(opt => (
                <button key={opt.val}
                  onClick={() => { setFilterTrack(opt.val); setPage(1) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border
                              transition-all
                              ${filterTrack === opt.val
                                ? 'bg-blue-700 text-white border-blue-700'
                                : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <span className="badge badge-blue">
            <span className="material-icons text-xs">menu_book</span>
            {filtered.length} មុខវិជ្ជា
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">Code</th>
                <th className="table-th">ឈ្មោះមុខវិជ្ជា</th>
                <th className="table-th">Grade</th>
                <th className="table-th">Track</th>
                <th className="table-th text-center">ម៉ោង/សប្តាហ៍</th>
                <th className="table-th text-center">ឆមាស</th>
                <th className="table-th text-center">ស្ថានភាព</th>
                <th className="table-th text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={9} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr><td colSpan={9} className="py-16 text-center">
                  <span className="material-icons text-5xl text-gray-200 block mb-3">
                    menu_book
                  </span>
                  <p className="text-gray-400 text-sm">
                    {search ? 'រកមិនឃើញ' : 'គ្មានមុខវិជ្ជា'}
                  </p>
                </td></tr>
              )}
              {paginated.map((s, i) => {
                const track = guessTrack(s.code)
                const tCfg  = TRACK_CFG[track]
                const pre   = getPredefined(s.code)
                const gradeLabel = track === 'general'
                  ? 'ថ្នាក់ទី ១០'
                  : 'ថ្នាក់ទី ១១-១២'
                return (
                  <tr key={s.id} className="table-tr-hover">
                    <td className="table-td text-gray-400 text-xs">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="table-td">
                      <span className={`font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg
                        ${track === 'science'        ? 'bg-blue-100 text-blue-700'   :
                          track === 'social_science' ? 'bg-purple-100 text-purple-700':
                          'bg-gray-100 text-gray-700'}`}>
                        {s.code}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center
                                        justify-center flex-shrink-0
                          ${track === 'science'        ? 'bg-blue-100'   :
                            track === 'social_science' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <span className={`material-icons text-base
                            ${track === 'science'        ? 'text-blue-600'   :
                              track === 'social_science' ? 'text-purple-600' : 'text-gray-500'}`}>
                            {tCfg.icon}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{s.name_kh}</p>
                          <p className="text-xs text-gray-400">{s.name_en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="badge badge-blue text-xs">{gradeLabel}</span>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${tCfg.cls}`}>
                        <span className="material-icons text-xs">{tCfg.icon}</span>
                        {tCfg.label}
                      </span>
                    </td>
                    <td className="table-td text-center">
                      <span className="font-bold text-gray-800 text-sm">
                        {pre?.hours || '—'}
                      </span>
                      {pre?.hours && (
                        <span className="text-xs text-gray-400 ml-0.5">h/w</span>
                      )}
                    </td>
                    <td className="table-td text-center">
                      <div className="flex gap-1 justify-center">
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5
                                         rounded border border-indigo-200">ស ១</span>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5
                                         rounded border border-indigo-200">ស ២</span>
                      </div>
                    </td>
                    <td className="table-td text-center">
                      <span className="badge badge-green">
                        <span className="material-icons text-xs">check_circle</span>
                        សកម្ម
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setDetailTarget(s)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                          title="មើលព័ត៌មាន">
                          <span className="material-icons text-base">visibility</span>
                        </button>
                        <button onClick={() => openEdit(s)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          title="កែប្រែ">
                          <span className="material-icons text-base">edit</span>
                        </button>
                        <button onClick={() => setDeleteTarget(s)}
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

      {/* ══ Subject Detail Modal ══ */}
      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)}
        title="ព័ត៌មានលម្អិតមុខវិជ្ជា" icon="menu_book" size="lg">
        {detailTarget && (() => {
          const track = guessTrack(detailTarget.code)
          const tCfg  = TRACK_CFG[track]
          const pre   = getPredefined(detailTarget.code)
          const gradeLabel = track === 'general' ? 'ថ្នាក់ទី ១០' : 'ថ្នាក់ទី ១១-១២'
          return (
            <div className="space-y-5">
              {/* Subject Hero */}
              <div className={`rounded-xl p-5 border-2
                ${track === 'science'        ? 'bg-blue-50 border-blue-200'   :
                  track === 'social_science' ? 'bg-purple-50 border-purple-200':
                  'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center
                                  justify-center flex-shrink-0 shadow-sm ${tCfg.bg}`}>
                    <span className="material-icons text-white text-3xl">{tCfg.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-xl">{detailTarget.name_kh}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{detailTarget.name_en}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`font-mono text-sm font-bold px-2.5 py-1 rounded-lg
                        ${track === 'science'        ? 'bg-blue-100 text-blue-700'    :
                          track === 'social_science' ? 'bg-purple-100 text-purple-700':
                          'bg-gray-100 text-gray-700'}`}>
                        {detailTarget.code}
                      </span>
                      <span className={`badge ${tCfg.cls}`}>
                        <span className="material-icons text-xs">{tCfg.icon}</span>
                        {tCfg.label}
                      </span>
                      <span className="badge badge-blue">{gradeLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 1: Basic Info */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3
                               flex items-center gap-1.5">
                  <span className="material-icons text-sm">info</span>
                  ព័ត៌មានមូលដ្ឋាន
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'tag',          label: 'លេខកូដ',         val: detailTarget.code    },
                    { icon: 'translate',    label: 'ឈ្មោះអង់គ្លេស', val: detailTarget.name_en },
                    { icon: 'school',       label: 'Grade',           val: gradeLabel           },
                    { icon: tCfg.icon,      label: 'Track',           val: tCfg.label           },
                  ].map(item => (
                    <div key={item.label}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center
                                      justify-center flex-shrink-0 shadow-sm">
                        <span className="material-icons text-blue-600 text-base">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="font-bold text-gray-800 text-sm">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Academic Info */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3
                               flex items-center gap-1.5">
                  <span className="material-icons text-sm">school</span>
                  ព័ត៌មានសិក្សា
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: 'schedule',       label: 'ម៉ោង/សប្តាហ៍',  val: pre?.hours ? `${pre.hours} ម៉ោង` : '—' },
                    { icon: 'event_note',     label: 'ឆមាស',           val: 'ឆមាស ១ + ២'                          },
                    { icon: 'meeting_room',   label: 'ថ្នាក់ប្រើ',     val: '—'                                    },
                  ].map(item => (
                    <div key={item.label}
                      className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="material-icons text-blue-600 text-2xl block mb-1">
                        {item.icon}
                      </span>
                      <p className="font-bold text-gray-800 text-sm">{item.val}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Teaching Assignment */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3
                               flex items-center gap-1.5">
                  <span className="material-icons text-sm">assignment_ind</span>
                  ការចាត់តាំងគ្រូ
                </p>
                <div className="flex flex-col items-center justify-center py-6 bg-gray-50
                                rounded-xl border border-dashed border-gray-200 text-gray-400">
                  <span className="material-icons text-3xl mb-2 text-gray-300">
                    supervisor_account
                  </span>
                  <p className="text-sm">ទាក់ទងនឹងតារាង Teacher Assignment</p>
                </div>
              </div>

              <button onClick={() => setDetailTarget(null)} className="btn-secondary w-full">
                <span className="material-icons text-lg">close</span>
                <span>បិទ</span>
              </button>
            </div>
          )
        })()}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal}
        title={editing ? 'កែប្រែមុខវិជ្ជា' : 'បន្ថែមមុខវិជ្ជា'}
        icon={editing ? 'edit' : 'add_circle'} size="md">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-700 rounded-lg px-3 py-2.5 mb-4 text-sm">
            <span className="material-icons text-red-500 text-base">error_outline</span>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <RequiredLabel>ឈ្មោះជាភាសាខ្មែរ</RequiredLabel>
            <input className="input-field" placeholder="ឧ: រូបវិទ្យា"
              value={form.name_kh}
              onChange={e => setForm({ ...form, name_kh: e.target.value })} required />
          </div>
          <div>
            <RequiredLabel>ឈ្មោះជាភាសាអង់គ្លេស</RequiredLabel>
            <input className="input-field" placeholder="e.g. Physics"
              value={form.name_en}
              onChange={e => setForm({ ...form, name_en: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <RequiredLabel>លេខកូដ</RequiredLabel>
              <input className="input-field font-mono uppercase" placeholder="PHY"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required />
            </div>
            <div>
              <RequiredLabel optional>ម៉ោង/សប្តាហ៍</RequiredLabel>
              <input type="number" className="input-field" min={1} max={10}
                value={form.hours}
                onChange={e => setForm({ ...form, hours: Number(e.target.value) })} />
            </div>
          </div>
          {/* Code hint */}
          {form.code && (
            <div className={`p-3 rounded-xl border text-sm
              ${guessTrack(form.code) === 'science'        ? 'bg-blue-50 border-blue-200 text-blue-700'    :
                guessTrack(form.code) === 'social_science' ? 'bg-purple-50 border-purple-200 text-purple-700':
                'bg-gray-50 border-gray-200 text-gray-600'}`}>
              <div className="flex items-center gap-2">
                <span className="material-icons text-base">
                  {TRACK_CFG[guessTrack(form.code)].icon}
                </span>
                <span className="font-semibold">
                  Track: {TRACK_CFG[guessTrack(form.code)].label}
                </span>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary flex-1">
              <span className="material-icons text-lg">close</span><span>បោះបង់</span>
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? <><Spinner /><span>រក្សាទុក...</span></> :
                <><span className="material-icons text-lg">save</span>
                  <span>{editing ? 'រក្សាទុក' : 'បន្ថែម'}</span></>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="លុបមុខវិជ្ជា" icon="warning_amber" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center
                          justify-center mx-auto mb-4">
            <span className="material-icons text-red-500 text-3xl">delete_forever</span>
          </div>
          <p className="font-bold text-gray-800 text-lg mb-2">លុប "{deleteTarget?.name_kh}"?</p>
          <p className="text-gray-500 text-sm mb-6">ការចាត់តាំងទាំងអស់នឹងត្រូវលុបផងដែរ</p>
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