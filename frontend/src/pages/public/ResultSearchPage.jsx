import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/axios'

export default function ResultSearchPage() {
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ studentName: '', dob: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.studentName.trim()) {
      setError('សូមបញ្ចូលឈ្មោះសិស្ស')
      return
    }
    if (!form.dob) {
      setError('សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើត')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/public/verify-student', {
        studentName: form.studentName.trim(),
        dob:         form.dob,
      })
      if (res.data.token) {
        sessionStorage.setItem('result_token',      res.data.token)
        sessionStorage.setItem('result_student_id', res.data.student_id)
        navigate('/results/view')
      }
    } catch (err) {
      const msg = err.response?.data?.message
      setError(msg || 'រកមិនឃើញទិន្នន័យ។ សូមពិនិត្យឈ្មោះ និងថ្ងៃខែឆ្នាំកំណើតម្ដងទៀត')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center
                          justify-center mx-auto mb-4 shadow-lg">
            <span className="material-icons text-white text-4xl">manage_search</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            ពិនិត្យលទ្ធផលសិក្សា
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            បញ្ចូលឈ្មោះ និងថ្ងៃខែឆ្នាំកំណើត ដើម្បីស្វែងរកលទ្ធផលសិក្សារបស់អ្នក
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6
                        flex items-start gap-3">
          <span className="material-icons text-blue-500 text-xl flex-shrink-0 mt-0.5">
            info
          </span>
          <div>
            <p className="font-semibold text-blue-800 text-sm">ការស្វែងរកដោយឈ្មោះ</p>
            <p className="text-blue-700 text-xs mt-0.5 leading-relaxed">
              ព័ត៌មានសិស្សនឹងត្រូវបង្ហាញ
              បន្ទាប់ពីការផ្ទៀងផ្ទាត់ឈ្មោះ និងថ្ងៃខែឆ្នាំកំណើតត្រឹមត្រូវ។
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200
                            text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <span className="material-icons text-red-500 text-base mt-0.5 flex-shrink-0">
                error_outline
              </span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-5">

            {/* Student Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ឈ្មោះសិស្ស (ខ្មែរ ឬ ឡាតាំង)
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  person_search
                </span>
                <input
                  className="input-field pl-10"
                  placeholder="ឧ. សុខ សាន្ត ឬ Sok San"
                  value={form.studentName}
                  onChange={e => setForm({ ...form, studentName: e.target.value })}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ថ្ងៃខែឆ្នាំកំណើត
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2
                                 text-gray-400 text-lg pointer-events-none">
                  cake
                </span>
                <input
                  type="date"
                  className="input-field pl-10"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                         bg-slate-900 hover:bg-slate-800 text-white font-bold text-base
                         transition-all duration-200 disabled:opacity-60 shadow-md mt-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <span>កំពុងស្វែងរក...</span>
                </>
              ) : (
                <>
                  <span className="material-icons text-xl">search</span>
                  <span>ស្វែងរកលទ្ធផល</span>
                </>
              )}
            </button>
          </form>

          {/* Help */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              ត្រូវការជំនួយ? ទំនាក់ទំនង
              <a href="tel:023456789"
                className="text-blue-600 hover:underline mx-1">
                023-456-789
              </a>
              ឬមក​ ការិយាល័យ​សាលា
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}