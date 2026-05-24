import { useEffect } from 'react'

export default function Modal({ open, onClose, title, icon, size = 'md', children }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl
                       flex flex-col max-h-[90vh] overflow-hidden`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center
                              justify-center flex-shrink-0">
                <span className="material-icons text-blue-700 text-xl">{icon}</span>
              </div>
            )}
            <h3 className="font-bold text-gray-800 text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       hover:bg-gray-100 text-gray-400 hover:text-gray-600
                       transition-colors">
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}