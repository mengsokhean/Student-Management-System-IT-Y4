import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import Breadcrumb from '../../components/common/Breadcrumb'
import Pagination from '../../components/common/Pagination'
import Modal      from '../../components/common/Modal'
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

const STEPS = [
  { id: 1, label: 'ព័ត៌មានផ្ទាល់ខ្លួន', icon: 'person'           },
  { id: 2, label: 'ព័ត៌មានឪពុកម្ដាយ',    icon: 'family_restroom' },
  { id: 3, label: 'ព័ត៌មានសិក្សា',       icon: 'school'          },
  { id: 4, label: 'ពិនិត្យ + ដាក់ស្នើ',  icon: 'fact_check'      },
]

const EMPTY_FORM = {
  // Step 1
  student_code:  '', name_kh: '', name_en: '',
  gender:        'male', date_of_birth: '',
  place_of_birth: '', phone: '', address: '',
  // Step 2
  father_name: '', father_phone: '',
  mother_name: '', mother_phone: '',
  guardian_name: '', guardian_phone: '',
  // Step 3
  academic_year_id: '', grade_id: '', classroom_id: '', track: '',
  // Account
  email: '', password: '',
}

const STATUS_CFG = {
  active:      { label: 'សកម្ម',    cls: 'badge-green'  },
  transferred: { label: 'ផ្ទេរ',     cls: 'badge-yellow' },
  dropped:     { label: 'ឈប់រៀន',   cls: 'badge-red'    },
  graduated:   { label: 'បញ្ចប់',    cls: 'badge-blue'   },
}

const TRACK_BADGE = {
  null: { label: 'ទូទៅ', cls: 'badge-gray',   icon: 'school'  },
  '':   { label: 'ទូទៅ', cls: 'badge-gray',   icon: 'school'  },
  science:        { label: 'វិទ្យាសាស្ត្រពិត', cls: 'badge-green',  icon: 'science' },
  social_science: { label: 'វិទ្យាសាស្ត្រសង្គម',cls: 'badge-purple', icon: 'public'  },
}

// Auto-generate student code
const genCode = () => `STU-${String(Date.now()).slice(-6)}`

export default function StudentRegistrationPage() {
  const [students,   setStudents]   = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [years,      setYears]      = useState([])
  const [grades,     setGrades]     = useState([])
  const [fetching,   setFetching]   = useState(true)

  // Filters
  const [search,       setSearch]       = useState('')
  const [filterGrade,  setFilterGrade]  = useState('')
  const [filterTrack,  setFilterTrack]  = useState('')
  const [filterStatus, setFilterStatus] = useState('active')

  // Pagination
  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Multi-step modal
  const [modalOpen, setModalOpen] = useState(false)
  const [step,      setStep]      = useState(1)
  const [form,      setForm]      = useState({ ...EMPTY_FORM, student_code: genCode() })
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')

  // Selected classroom to register
  const [selectedClassroom, setSelectedClassroom] = useState('')

  useEffect(() => {
    const load = async () => {
      setFetching(true)
      try {
        const [yr, gr, cr] = await Promise.all([
          api.get('/admin/academic-years'),
          api.get('/admin/grades'),
          api.get('/admin/classrooms'),
        ])
        setYears(yr.data)
        setGrades(gr.data)
        setClassrooms(cr.data)

        // Load students from first classroom (simplified)
        if (cr.data.length > 0) {
          const allStudents = []
          for (const c of cr.data.slice(0, 5)) {
            try {
              const r = await api.get(`/admin/classrooms/${c.id}/students`)
              r.data.forEach(s => {
                if (!allStudents.find(x => x.id === s.id)) {
                  allStudents.push({ ...s, classroom: c })
                }
              })
            } catch (_) {}
          }
          setStudents(allStudents)
        }
      } catch (_) {}
      setFetching(false)
    }
    load()
  }, [])

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 4000)
  }

  const openModal = () => {
    setStep(1)
    setForm({ ...EMPTY_FORM, student_code: genCode() })
    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setStep(1)
    setForm({ ...EMPTY_FORM, student_code: genCode() })
    setError('')
  }

  const selectedGradeLevel = grades.find(g => g.id == form.grade_id)?.level

  const filteredClassrooms = classrooms.filter(c => {
    if (!form.grade_id) return true
    if (c.grade_id?.toString() !== form.grade_id) return false
    if (selectedGradeLevel === '10') return true
    if (form.track && c.track !== form.track) return false
    return true
  })

  // Validate each step
  const validateStep = () => {
    if (step === 1) {
      if (!form.name_kh || !form.name_en || !form.date_of_birth) {
        setError('សូមបំពេញឈ្មោះ និងថ្ងៃខែឆ្នាំ')
        return false
      }
    }
    if (step === 2) {
      if (!form.guardian_name || !form.guardian_phone) {
        setError('សូមបំពេញព័ត៌មានអ្នកអាណាព្យាបាល')
        return false
      }
    }
    if (step === 3) {
      if (!form.academic_year_id || !form.grade_id || !form.classroom_id) {
        setError('សូមជ្រើសសិក្សាឆ្នាំ ថ្នាក់ ហើយនិងថ្នាក់រៀន')
        return false
      }
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post('/admin/enrollment', {
        classroom_id:   form.classroom_id,
        student_code:   form.student_code,
        name_kh:        form.name_kh,
        name_en:        form.name_en,
        date_of_birth:  form.date_of_birth,
        gender:         form.gender,
        guardian_name:  form.guardian_name || form.father_name || form.mother_name,
        guardian_phone: form.guardian_phone || form.father_phone || form.mother_phone,
        phone:          form.phone,
        address:        form.address,
        email:          form.email || undefined,
        password:       form.password || undefined,
      })
      showSuccess(`ចុះឈ្មោះ ${form.name_kh} ជោគជ័យ!`)
      closeModal()
      // Reload
      const r = await api.get(`/admin/classrooms/${form.classroom_id}/students`)
      setStudents(prev => {
        const existing = prev.filter(s => s.classroom?.id?.toString() !== form.classroom_id)
        const room = classrooms.find(c => c.id?.toString() === form.classroom_id)
        return [...existing, ...r.data.map(s => ({ ...s, classroom: room }))]
      })
    } catch (err) {
      setError(err.response?.data?.message || 'មានបញ្ហា')
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const headers = ['លេខកូដ', 'ឈ្មោះខ្មែរ', 'ឈ្មោះអង់គ្លេស', 'ភេទ', 'ថ្ងៃខែ', 'ថ្នាក់', 'Track']
    const rows = filtered.map(s => [
      s.student_code, s.name_kh, s.name_en,
      s.gender === 'male' ? 'ប្រុស' : 'ស្រី',
      s.date_of_birth || '',
      s.classroom?.name || '',
      TRACK_BADGE[s.classroom?.track]?.label || '',
    ])
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'students.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = students.filter(s => {
    const track = s.classroom?.track
    const matchSearch = !search ||
      s.name_kh.includes(search) ||
      s.name_en.toLowerCase().includes(search.toLowerCase()) ||
      s.student_code.toLowerCase().includes(search.toLowerCase())
    const matchGrade  = !filterGrade  || s.classroom?.grade_id?.toString() === filterGrade
    const matchTrack  = !filterTrack  ||
      (filterTrack === '__general__' ? !track : track === filterTrack)
    const matchStatus = !filterStatus || (s.pivot?.status || 'active') === filterStatus
    return matchSearch && matchGrade && matchTrack && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  const maleCount   = students.filter(s => s.gender === 'male').length
  const femaleCount = students.filter(s => s.gender === 'female').length

  return (
    <div className="space-y-4">
      <Breadcrumb items={[
        { label: 'ទំព័រដើម',  path: '/admin/dashboard', icon: 'home'   },
        { label: 'គ្រប់គ្រង', path: '#'                                 },
        { label: 'ចុះឈ្មោះសិស្ស' },
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
          { icon: 'groups',        iconBg: 'bg-blue-600',   label: 'សិស្សសរុប',   value: students.length },
          { icon: 'person_add',    iconBg: 'bg-green-600',  label: 'ថ្មីខែនេះ',    value: '—'            },
          { icon: 'male',          iconBg: 'bg-sky-600',    label: 'ប្រុស',         value: maleCount      },
          { icon: 'female',        iconBg: 'bg-pink-500',   label: 'ស្រី',          value: femaleCount    },
        ].map((s, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center
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
          <h2 className="text-xl font-bold text-gray-800">ចុះឈ្មោះ និងគ្រប់គ្រងសិស្ស</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            ដំណើរការចុះឈ្មោះ ៤ ជំហាន
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport}
            disabled={students.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-green-200
                       bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium
                       disabled:opacity-40">
            <span className="material-icons text-base">download</span>
            Export CSV
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200
                            bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium cursor-pointer">
            <span className="material-icons text-base">upload</span>
            Import CSV
            <input type="file" accept=".csv" className="hidden"
              onChange={e => { alert('Import — coming soon!'); e.target.value = '' }} />
          </label>
          <button onClick={openModal} className="btn-primary">
            <span className="material-icons text-lg">person_add</span>
            <span>ចុះឈ្មោះសិស្ស</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {/* Filters */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center
                        justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 text-lg">search</span>
              <input className="border border-gray-200 rounded-lg pl-10 pr-4 py-2
                                text-sm focus:outline-none focus:ring-2 focus:ring-blue-400
                                w-60 bg-white"
                placeholder="ស្វែងរកសិស្ស..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <select value={filterGrade}
              onChange={e => { setFilterGrade(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              <option value="">ថ្នាក់ទីទាំងអស់</option>
              {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <div className="flex items-center gap-1.5">
              {[
                { val: '',             label: 'ទាំងអស់'             },
                { val: '__general__',  label: 'ទូទៅ'                },
                { val: 'science',      label: 'វិទ្យាសាស្ត្រពិត'    },
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
            <span className="material-icons text-xs">groups</span>
            {filtered.length} នាក់
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th w-10">#</th>
                <th className="table-th">សិស្ស</th>
                <th className="table-th">លេខសម្គាល់</th>
                <th className="table-th">ថ្នាក់ + Track</th>
                <th className="table-th">ថ្ងៃខែ</th>
                <th className="table-th">ភេទ</th>
                <th className="table-th">អាណាព្យាបាល</th>
                <th className="table-th text-center">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {fetching && (
                <tr><td colSpan={8} className="py-16 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Spinner cls="h-5 w-5" /><span>កំពុងផ្ទុក...</span>
                  </div>
                </td></tr>
              )}
              {!fetching && paginated.length === 0 && (
                <tr><td colSpan={8} className="py-16 text-center">
                  <span className="material-icons text-5xl text-gray-200 block mb-3">
                    school
                  </span>
                  <p className="text-gray-400 text-sm">
                    {search ? 'រកមិនឃើញ' : 'គ្មានសិស្ស'}
                  </p>
                </td></tr>
              )}
              {paginated.map((s, i) => {
                const status  = s.pivot?.status || 'active'
                const sCfg    = STATUS_CFG[status] || STATUS_CFG.active
                const track   = s.classroom?.track
                const tCfg    = TRACK_BADGE[track] || TRACK_BADGE['']
                return (
                  <tr key={s.id} className="table-tr-hover">
                    <td className="table-td text-gray-400 text-xs">
                      {(page - 1) * perPage + i + 1}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center
                                        justify-center flex-shrink-0 font-bold text-sm
                          ${s.gender === 'female'
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-blue-100 text-blue-600'}`}>
                          {s.name_kh.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{s.name_kh}</p>
                          <p className="text-xs text-gray-400">{s.name_en}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700
                                       px-2 py-1 rounded-md">
                        {s.student_code}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5">
                        <span className="badge badge-blue text-xs">
                          {s.classroom?.grade?.name || '—'}
                        </span>
                        <span className={`badge ${tCfg.cls} text-xs`}>
                          <span className="material-icons text-xs">{tCfg.icon}</span>
                          {tCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {s.classroom?.name}
                      </p>
                    </td>
                    <td className="table-td text-sm text-gray-500">
                      {s.date_of_birth || '—'}
                    </td>
                    <td className="table-td">
                      <span className={`badge ${s.gender === 'female' ? 'badge-red' : 'badge-blue'}`}>
                        <span className="material-icons text-xs">
                          {s.gender === 'female' ? 'female' : 'male'}
                        </span>
                        {s.gender === 'female' ? 'ស្រី' : 'ប្រុស'}
                      </span>
                    </td>
                    <td className="table-td">
                      <p className="text-sm font-medium text-gray-700">{s.guardian_name}</p>
                      <p className="text-xs text-gray-400">{s.guardian_phone}</p>
                    </td>
                    <td className="table-td text-center">
                      <span className={`badge ${sCfg.cls}`}>{sCfg.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page} totalPages={totalPages}
          perPage={perPage} total={filtered.length}
          onPageChange={setPage}
          onPerPageChange={n => { setPerPage(n); setPage(1) }}
        />
      </div>

      {/* ══ Multi-Step Registration Modal ══ */}
      <Modal open={modalOpen} onClose={closeModal}
        title="ចុះឈ្មោះសិស្សថ្មី" icon="how_to_reg" size="xl">

        {/* Step Indicator */}
        <div className="flex items-center mb-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                transition-all
                  ${step === s.id ? 'bg-blue-700 text-white shadow-md scale-110' :
                    step > s.id  ? 'bg-green-500 text-white' :
                    'bg-gray-100 text-gray-400'}`}>
                  {step > s.id
                    ? <span className="material-icons text-xl">check</span>
                    : <span className="material-icons text-xl">{s.icon}</span>
                  }
                </div>
                <p className={`text-xs mt-1.5 font-semibold text-center leading-tight
                  ${step === s.id ? 'text-blue-700' :
                    step > s.id  ? 'text-green-600' : 'text-gray-400'}`}>
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all
                  ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-700 rounded-lg px-3 py-2.5 mb-4 text-sm">
            <span className="material-icons text-red-500 text-base">error_outline</span>
            {error}
          </div>
        )}

        {/* ── Step 1: Personal Info ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-blue-600 text-lg">person</span>
              <p className="font-bold text-gray-700 text-sm">ព័ត៌មានផ្ទាល់ខ្លួន</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <RequiredLabel>លេខសម្គាល់សិស្ស</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">badge</span>
                  <input className="input-field pl-10 font-mono"
                    value={form.student_code}
                    onChange={e => setForm({ ...form, student_code: e.target.value })} />
                </div>
                <button type="button"
                  onClick={() => setForm({ ...form, student_code: genCode() })}
                  className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1">
                  <span className="material-icons text-sm">refresh</span>
                  បង្កើតលេខថ្មី
                </button>
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
                        value={opt.val}
                        checked={form.gender === opt.val}
                        onChange={() => setForm({ ...form, gender: opt.val })} />
                      <span className={`material-icons text-xl
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
                <RequiredLabel>ថ្ងៃខែឆ្នាំកំណើត</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">cake</span>
                  <input type="date" className="input-field pl-10"
                    value={form.date_of_birth}
                    onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
                    required />
                </div>
              </div>

              <div>
                <RequiredLabel>ឈ្មោះជាភាសាខ្មែរ</RequiredLabel>
                <input className="input-field" placeholder="ឧ: ហេង ស្រីនិច"
                  value={form.name_kh}
                  onChange={e => setForm({ ...form, name_kh: e.target.value })}
                  required />
              </div>

              <div>
                <RequiredLabel>ឈ្មោះជាភាសាអង់គ្លេស</RequiredLabel>
                <input className="input-field" placeholder="e.g. Heng Srey Nich"
                  value={form.name_en}
                  onChange={e => setForm({ ...form, name_en: e.target.value })}
                  required />
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

              <div>
                <RequiredLabel optional>ទីកន្លែងកំណើត</RequiredLabel>
                <input className="input-field" placeholder="ខេត្ត/ក្រុង"
                  value={form.place_of_birth}
                  onChange={e => setForm({ ...form, place_of_birth: e.target.value })} />
              </div>

              <div className="md:col-span-2">
                <RequiredLabel optional>អាសយដ្ឋាន</RequiredLabel>
                <textarea className="input-field resize-none" rows={2}
                  placeholder="ភូមិ សង្កាត់ ក្រុង ខេត្ត"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Parent Info ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-blue-600 text-lg">family_restroom</span>
              <p className="font-bold text-gray-700 text-sm">ព័ត៌មានឪពុកម្ដាយ / អាណាព្យាបាល</p>
            </div>

            {/* Father */}
            <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                <span className="material-icons text-sm">man</span>
                ព័ត៌មានឪពុក
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <RequiredLabel optional>ឈ្មោះឪពុក</RequiredLabel>
                  <input className="input-field" placeholder="ឈ្មោះ"
                    value={form.father_name}
                    onChange={e => setForm({ ...form, father_name: e.target.value })} />
                </div>
                <div>
                  <RequiredLabel optional>ទូរស័ព្ទឪពុក</RequiredLabel>
                  <input className="input-field" placeholder="0xx xxx xxx"
                    value={form.father_phone}
                    onChange={e => setForm({ ...form, father_phone: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Mother */}
            <div className="border border-pink-100 bg-pink-50/30 rounded-xl p-4">
              <p className="text-xs font-bold text-pink-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                <span className="material-icons text-sm">woman</span>
                ព័ត៌មានម្ដាយ
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <RequiredLabel optional>ឈ្មោះម្ដាយ</RequiredLabel>
                  <input className="input-field" placeholder="ឈ្មោះ"
                    value={form.mother_name}
                    onChange={e => setForm({ ...form, mother_name: e.target.value })} />
                </div>
                <div>
                  <RequiredLabel optional>ទូរស័ព្ទម្ដាយ</RequiredLabel>
                  <input className="input-field" placeholder="0xx xxx xxx"
                    value={form.mother_phone}
                    onChange={e => setForm({ ...form, mother_phone: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Guardian */}
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                <span className="material-icons text-sm">person_outline</span>
                អ្នកអាណាព្យាបាល (Guardian) <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <RequiredLabel>ឈ្មោះអ្នកអាណាព្យាបាល</RequiredLabel>
                  <input className="input-field" placeholder="ឈ្មោះ"
                    value={form.guardian_name}
                    onChange={e => setForm({ ...form, guardian_name: e.target.value })}
                    required />
                </div>
                <div>
                  <RequiredLabel>ទូរស័ព្ទអ្នកអាណាព្យាបាល</RequiredLabel>
                  <input className="input-field" placeholder="0xx xxx xxx"
                    value={form.guardian_phone}
                    onChange={e => setForm({ ...form, guardian_phone: e.target.value })}
                    required />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Academic Info ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-blue-600 text-lg">school</span>
              <p className="font-bold text-gray-700 text-sm">ព័ត៌មានសិក្សា</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <RequiredLabel>ឆ្នាំសិក្សា</RequiredLabel>
                <select className="input-field"
                  value={form.academic_year_id}
                  onChange={e => setForm({ ...form, academic_year_id: e.target.value })}
                  required>
                  <option value="">-- ជ្រើស --</option>
                  {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
              </div>
              <div>
                <RequiredLabel>ថ្នាក់ទី</RequiredLabel>
                <select className="input-field"
                  value={form.grade_id}
                  onChange={e => setForm({ ...form, grade_id: e.target.value, track: '', classroom_id: '' })}
                  required>
                  <option value="">-- ជ្រើស --</option>
                  {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>

              {/* Track — only for Grade 11, 12 */}
              {(selectedGradeLevel === '11' || selectedGradeLevel === '12') && (
                <div className="md:col-span-2">
                  <RequiredLabel>
                    Track / កម្មវិធីសិក្សា
                    {selectedGradeLevel === '11'
                      ? ' (ថ្នាក់ទី១១)'
                      : ' (ថ្នាក់ទី១២ — ឆ្នាំចុងក្រោយ)'}
                  </RequiredLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'science',        label: 'វិទ្យាសាស្ត្រពិត',    icon: 'science',
                        desc: 'រូបវិទ្យា គីមី ជីវវិទ្យា គណិត',
                        color: 'border-green-500 bg-green-50', tc: 'text-green-700', ic: 'text-green-600' },
                      { val: 'social_science', label: 'វិទ្យាសាស្ត្រសង្គម', icon: 'public',
                        desc: 'ប្រវត្តិ ភូមិ សេដ្ឋកិច្ច ពលរដ្ឋ',
                        color: 'border-purple-500 bg-purple-50', tc: 'text-purple-700', ic: 'text-purple-600' },
                    ].map(opt => (
                      <label key={opt.val}
                        className={`flex items-start gap-3 border-2 rounded-xl px-4 py-3.5
                                    cursor-pointer transition-all
                                    ${form.track === opt.val
                                      ? opt.color
                                      : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" className="sr-only"
                          value={opt.val}
                          checked={form.track === opt.val}
                          onChange={() => setForm({ ...form, track: opt.val, classroom_id: '' })} />
                        <span className={`material-icons text-2xl mt-0.5 flex-shrink-0
                          ${form.track === opt.val ? opt.ic : 'text-gray-300'}`}>
                          {opt.icon}
                        </span>
                        <div className="flex-1">
                          <p className={`font-bold text-sm
                            ${form.track === opt.val ? opt.tc : 'text-gray-500'}`}>
                            {opt.label}
                          </p>
                          <p className={`text-xs mt-0.5
                            ${form.track === opt.val ? opt.tc : 'text-gray-400'}`}>
                            {opt.desc}
                          </p>
                        </div>
                        {form.track === opt.val && (
                          <span className="material-icons text-green-500 text-lg flex-shrink-0">
                            check_circle
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedGradeLevel === '10' && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200
                                  rounded-xl p-4">
                    <span className="material-icons text-gray-500 text-2xl">school</span>
                    <div>
                      <p className="font-bold text-gray-700 text-sm">ទូទៅ (General Education)</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ថ្នាក់ទី១០ ប្រើកម្មវិធីទូទៅ — ចាត់ដោយស្វ័យប្រវត្តិ
                      </p>
                    </div>
                    <span className="badge badge-gray ml-auto">
                      <span className="material-icons text-xs">check_circle</span>
                      ទូទៅ
                    </span>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <RequiredLabel>ថ្នាក់រៀន</RequiredLabel>
                <select className="input-field"
                  value={form.classroom_id}
                  onChange={e => setForm({ ...form, classroom_id: e.target.value })}
                  disabled={!form.grade_id || (
                    (selectedGradeLevel === '11' || selectedGradeLevel === '12') && !form.track
                  )}
                  required>
                  <option value="">-- ជ្រើស --</option>
                  {filteredClassrooms.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.grade?.name}
                      {c.track ? ` (${c.track === 'science' ? 'វិទ្យាសាស្ត្រពិត' : 'វិទ្យាសាស្ត្រសង្គម'})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1">
                    <span className="material-icons text-sm">lock</span>
                    គណនីចូលប្រព័ន្ធ (ស្រេចចិត្ត)
                  </span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>
              </div>

              <div>
                <RequiredLabel optional>អ៊ីមែល</RequiredLabel>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">
                    alternate_email
                  </span>
                  <input type="email" className="input-field pl-10"
                    placeholder="student@school.edu.kh"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>

              {form.email && (
                <div>
                  <RequiredLabel>ពាក្យសម្ងាត់</RequiredLabel>
                  <div className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                     text-gray-400 text-lg pointer-events-none">lock_outline</span>
                    <input type="password" className="input-field pl-10"
                      placeholder="យ៉ាងហោចណាស់ ៦ ខ្ទង់"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required={!!form.email} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-blue-600 text-lg">fact_check</span>
              <p className="font-bold text-gray-700 text-sm">ពិនិត្យ + ដាក់ស្នើ</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2">
              <p className="text-sm text-green-700 font-medium flex items-center gap-1.5">
                <span className="material-icons text-base">info</span>
                សូមពិនិត្យព័ត៌មានម្ដងទៀតមុននឹងដាក់ស្នើ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal */}
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-gray-700 text-xs uppercase tracking-wide mb-3
                               flex items-center gap-1.5">
                  <span className="material-icons text-blue-600 text-base">person</span>
                  ព័ត៌មានផ្ទាល់ខ្លួន
                </p>
                {[
                  { l: 'លេខ',        v: form.student_code  },
                  { l: 'ឈ្មោះខ្មែរ', v: form.name_kh       },
                  { l: 'ឈ្មោះអង់',   v: form.name_en       },
                  { l: 'ភេទ',        v: form.gender === 'male' ? 'ប្រុស' : 'ស្រី' },
                  { l: 'ថ្ងៃកំណើត',  v: form.date_of_birth  },
                  { l: 'ទូរស័ព្ទ',   v: form.phone || '—'   },
                ].map(item => (
                  <div key={item.l} className="flex justify-between text-sm py-1
                                               border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-xs">{item.l}</span>
                    <span className="font-semibold text-gray-800 text-xs">{item.v}</span>
                  </div>
                ))}
              </div>

              {/* Academic */}
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="font-bold text-gray-700 text-xs uppercase tracking-wide mb-3
                               flex items-center gap-1.5">
                  <span className="material-icons text-green-600 text-base">school</span>
                  ព័ត៌មានសិក្សា
                </p>
                {[
                  { l: 'ឆ្នាំសិក្សា', v: years.find(y => y.id?.toString() === form.academic_year_id)?.name || '—' },
                  { l: 'ថ្នាក់ទី',    v: grades.find(g => g.id == form.grade_id)?.name || '—'                  },
                  { l: 'Track',        v: form.track === 'science' ? 'វិទ្យាសាស្ត្រពិត' :
                                          form.track === 'social_science' ? 'វិទ្យាសាស្ត្រសង្គម' : 'ទូទៅ'   },
                  { l: 'ថ្នាក់រៀន',   v: classrooms.find(c => c.id?.toString() === form.classroom_id)?.name || '—' },
                  { l: 'អ្នកអាណ.',    v: form.guardian_name  },
                  { l: 'ទូរស័ព្ទ',    v: form.guardian_phone },
                ].map(item => (
                  <div key={item.l} className="flex justify-between text-sm py-1
                                               border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-xs">{item.l}</span>
                    <span className="font-semibold text-gray-800 text-xs">{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
          <button type="button"
            onClick={step === 1 ? closeModal : handleBack}
            className="btn-secondary">
            <span className="material-icons text-lg">
              {step === 1 ? 'close' : 'arrow_back'}
            </span>
            <span>{step === 1 ? 'បោះបង់' : 'ថយក្រោយ'}</span>
          </button>

          <div className="flex items-center gap-2">
            {STEPS.map(s => (
              <div key={s.id}
                className={`w-2 h-2 rounded-full transition-all
                  ${step === s.id ? 'bg-blue-700 w-6' :
                    step > s.id ? 'bg-green-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>

          {step < 4 ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              <span>បន្ទាប់</span>
              <span className="material-icons text-lg">arrow_forward</span>
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="btn-primary">
              {loading
                ? <><Spinner /><span>ដាក់ស្នើ...</span></>
                : <><span className="material-icons text-lg">how_to_reg</span>
                   <span>ចុះឈ្មោះ</span></>
              }
            </button>
          )}
        </div>
      </Modal>
    </div>
  )
}