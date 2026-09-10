import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const NAV_LINKS = [
  { to: '/',             label: 'ទំព័រដើម'          },
  { to: '/about',        label: 'អំពីសាលា'          },
  { to: '/news',         label: 'ព័ត៌មានថ្មីៗ'       },
  { to: '/announcements',label: 'សេចក្ដីជូនដំណឹង'  },
  { to: '/results',      label: 'ពិនិត្យលទ្ធផល',  highlight: true },
  { to: '/contact',      label: 'ទំនាក់ទំនង'         },
]

export default function PublicLayout() {
  const location   = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50"
      style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>



      {/* Header */}
      <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <img src="/niei-logo.png" alt="NIEI Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                វិទ្យាល័យ NIEI
              </p>
              <p className="text-slate-500 text-xs font-medium leading-tight">
                High School
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = location.pathname === link.to
              if (link.highlight) return (
                <Link key={link.to} to={link.to}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg
                             bg-slate-900 hover:bg-slate-800 text-white text-sm
                             font-semibold transition-colors shadow-sm ml-2">
                  <span className="material-icons text-base">search</span>
                  {link.label}
                </Link>
              )
              return (
                <Link key={link.to} to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center
                       rounded-lg hover:bg-gray-100 transition-colors">
            <span className="material-icons text-gray-700">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm
                            font-medium transition-colors
                  ${link.highlight
                    ? 'bg-slate-900 text-white'
                    : location.pathname === link.to
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'}`}>
                {link.highlight && (
                  <span className="material-icons text-base">search</span>
                )}
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-2 mt-2 flex gap-2">
              <a href="http://127.0.0.1:8000/admin/login" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-3 py-2 rounded-lg bg-slate-100
                           text-slate-700 text-xs font-medium">
                Admin Login
              </a>
              <a href="http://127.0.0.1:8000/teacher/login" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center px-3 py-2 rounded-lg bg-blue-100
                           text-blue-700 text-xs font-medium">
                Teacher Login
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl p-1">
                  <img src="/niei-logo.png" alt="NIEI Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-lg">NIEI High School</p>
                  <p className="text-slate-400 text-xs">រាជធានីភ្នំពេញ</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                NIEI High School ជាគ្រឹះស្ថានអប់រំដ៏ល្បីល្បាញ
                ដែលប្ដេជ្ញាផ្ដល់នូវការអប់រំ
                ប្រកបដោយគុណភាព
                ដល់យុវជនកម្ពុជា។
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="font-semibold text-white mb-3">ទំព័ររហ័ស</p>
              <div className="space-y-2">
                {NAV_LINKS.map(link => (
                  <Link key={link.to} to={link.to}
                    className="block text-slate-400 hover:text-white text-sm
                               transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold text-white mb-3">ទំនាក់ទំនង</p>
              <div className="space-y-2 text-sm text-slate-400">
                {[
                  { icon: 'location_on', text: 'រាជធានីភ្នំពេញ, កម្ពុជា'       },
                  { icon: 'phone',       text: '023-456-789'                    },
                  { icon: 'email',       text: 'info@niei.edu.kh'   },
                  { icon: 'schedule',    text: 'ច-ស: ០៧:០០ - ១២:០០'           },
                ].map(item => (
                  <div key={item.icon} className="flex items-start gap-2">
                    <span className="material-icons text-blue-400 text-sm mt-0.5 flex-shrink-0">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-5 flex items-center
                          justify-between flex-wrap gap-3">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} NIEI High School · All rights reserved
            </p>
            <div className="flex items-center gap-3">
              <a href="http://127.0.0.1:8000/admin/login"
                className="text-slate-500 hover:text-white text-xs transition-colors">
                Admin Portal
              </a>
              <span className="text-slate-700">·</span>
              <a href="http://127.0.0.1:8000/teacher/login"
                className="text-slate-500 hover:text-white text-xs transition-colors">
                Teacher Portal
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}