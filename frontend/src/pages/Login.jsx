import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import useAuthStore from '../store/authStore'

export default function Login() {
  const navigate    = useNavigate()
  const { setAuth } = useAuthStore()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await api.post('/auth/login', form)
      const { user, token } = res.data
      setAuth(user, token)
      if (user.role === 'admin')   navigate('/admin/dashboard')
      if (user.role === 'teacher') navigate('/teacher/dashboard')
      if (user.role === 'student') navigate('/student/dashboard')
    } catch (err) {
      const msg = err.response?.data?.errors?.email?.[0]
               || err.response?.data?.message
               || 'អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ។'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Top: Logo + School name */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-icons text-blue-800 text-3xl">school</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">វិទ្យាល័យហ៊ុនសែន</p>
              <p className="text-blue-300 text-sm">ខេត្តព្រះសីហនុ</p>
            </div>
          </div>

          <h1 className="text-white text-4xl font-bold leading-snug mb-4">
            ប្រព័ន្ធគ្រប់គ្រង<br />
            <span className="text-blue-300">សិស្សានុសិស្ស</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            ប្រព័ន្ធគ្រប់គ្រងសិស្ស វត្តមាន ពិន្ទុ និងរបាយការណ៍
            សម្រាប់ថ្នាក់ទី ១០ · ១១ · ១២
          </p>
        </div>

        {/* Middle: Feature list */}
        <div className="relative z-10 space-y-4">
          {[
            { icon: 'how_to_reg',   label: 'ចុះឈ្មោះ និងគ្រប់គ្រងសិស្ស'       },
            { icon: 'fact_check',   label: 'ចុះវត្តមានប្រចាំថ្ងៃ'              },
            { icon: 'grade',        label: 'បញ្ចូល និងគណនាពិន្ទុគ្រប់វគ្គ'    },
            { icon: 'summarize',    label: 'បោះពុម្ភសន្លឹកពិន្ទុ និងរបាយការណ៍' },
          ].map((f) => (
            <div key={f.icon} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-800 bg-opacity-60 flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-blue-300 text-lg">{f.icon}</span>
              </div>
              <span className="text-slate-300 text-sm">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom: year */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} · Student Management System · v1.0.0
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center">
              <span className="material-icons text-white text-2xl">school</span>
            </div>
            <div>
              <p className="font-bold text-gray-800">វិទ្យាល័យហ៊ុនសែន</p>
              <p className="text-gray-500 text-xs">ប្រព័ន្ធគ្រប់គ្រងសិស្ស</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">ចូលប្រើប្រព័ន្ធ</h2>
              <p className="text-gray-500 text-sm mt-1">
                សូមបញ្ចូលព័ត៌មានដើម្បីចូលប្រើប្រាស់
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200
                              text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
                <span className="material-icons text-red-500 text-base mt-0.5 flex-shrink-0">
                  error_outline
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="input-label">
                  អ៊ីមែល
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">
                    alternate_email
                  </span>
                  <input
                    type="email"
                    className="input-field pl-10"
                    placeholder="example@school.edu.kh"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="input-label">
                  ពាក្យសម្ងាត់
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400 text-lg pointer-events-none">
                    lock_outline
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="material-icons text-lg">
                      {showPw ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Role hint */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <p className="text-xs text-blue-700 font-semibold mb-2 flex items-center gap-1.5">
                  <span className="material-icons text-sm">info</span>
                  គណនីសាកល្បង
                </p>
                <div className="grid grid-cols-1 gap-1 text-xs text-blue-600">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-xs">admin_panel_settings</span>
                    <span className="font-mono">admin@school.edu.kh</span>
                    <span className="text-blue-400">/ password</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-xs">person</span>
                    <span className="font-mono">teacher01@school.edu.kh</span>
                    <span className="text-blue-400">/ password</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-base py-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <span>កំពុងចូល...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons text-lg">login</span>
                    <span>ចូលប្រើប្រព័ន្ធ</span>
                  </>
                )}
              </button>
            </form>

            {/* Role badges */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">ប្រភេទគណនីក្នុងប្រព័ន្ធ</p>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="badge badge-purple">
                  <span className="material-icons text-xs">admin_panel_settings</span>
                  អ្នកគ្រប់គ្រង
                </span>
                <span className="badge badge-blue">
                  <span className="material-icons text-xs">person</span>
                  គ្រូបង្រៀន
                </span>
                <span className="badge badge-green">
                  <span className="material-icons text-xs">school</span>
                  សិស្ស
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            ប្រព័ន្ធគ្រប់គ្រងសិស្ស · វិទ្យាល័យ · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}