import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call — replace with real endpoint when ready
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccessMessage(
        'សូមអរគុណ! សាររបស់អ្នកត្រូវបានផ្ញើទៅកាន់សាលាដោយជោគជ័យ។ យើងខ្ញុំនឹងទាក់ទងទៅវិញក្នុងពេលឆាប់ៗនេះ។'
      )
    }, 1400)
  }

  const handleReset = () => {
    setSuccessMessage('')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  // Shared premium input class
  const inputCls =
    'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm ' +
    'text-gray-800 placeholder-gray-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent ' +
    'transition-all duration-150'

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">ទំនាក់ទំនង</h1>
          <p className="text-gray-500">
            ទំនាក់ទំនងមកកាន់ក្រុមការងាររបស់យើង
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Contact Info ── */}
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 text-xl">ព័ត៌មានទំនាក់ទំនង</h2>
            {[
              { icon: 'location_on', label: 'អាសយដ្ឋាន', val: 'រាជធានីភ្នំពេញ, កម្ពុជា' },
              { icon: 'phone',       label: 'ទូរស័ព្ទ',   val: '023-456-789'              },
              { icon: 'email',       label: 'អ៊ីមែល',      val: 'info@niei.edu.kh'        },
              { icon: 'schedule',    label: 'ម៉ោងធ្វើការ', val: 'ច - ស · ០៧:០០ - ១២:០០'  },
            ].map(item => (
              <div key={item.label}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border
                           border-slate-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md
                           transition-all duration-200">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center
                                justify-center flex-shrink-0">
                  <span className="material-icons text-slate-700 text-xl">{item.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Contact Form ── */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg">
            <h2 className="font-bold text-gray-800 text-xl mb-5">ផ្ញើសំណួរ</h2>

            {successMessage ? (
              /* ── Success State ── */
              <div className="bg-green-50 text-green-800 border border-green-200
                              rounded-xl p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center
                                justify-center mx-auto mb-4">
                  <span className="material-icons text-green-600 text-3xl">check_circle</span>
                </div>
                <p className="font-bold text-lg mb-2">ផ្ញើជោគជ័យ!</p>
                <p className="text-sm leading-relaxed text-green-700">
                  {successMessage}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold
                             text-green-700 hover:text-green-900 transition-colors">
                  <span className="material-icons text-sm">refresh</span>
                  ផ្ញើម្ដងទៀត
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    ឈ្មោះ <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputCls}
                    placeholder="ឈ្មោះពេញ"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    អ៊ីមែល <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="example@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    ទូរស័ព្ទ
                  </label>
                  <input
                    type="tel"
                    className={inputCls}
                    placeholder="0xx xxx xxx"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    សារ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={4}
                    placeholder="សំណួររបស់អ្នក..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-slate-900 hover:bg-slate-800 text-white font-bold
                             transition-all duration-200 disabled:opacity-60 shadow-md mt-1">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>កំពុងផ្ញើ...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-xl">send</span>
                      <span>ផ្ញើសំណួរ</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}