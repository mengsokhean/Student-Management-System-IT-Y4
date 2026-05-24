import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuthStore from '../../store/authStore'

export default function MainLayout() {
  const { user } = useAuthStore()

  const today = new Date().toLocaleDateString('km-KH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-gray-100"
      style={{ fontFamily: "'Kantumruy Pro', sans-serif" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3
                           flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs text-gray-400">{today}</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center
                               rounded-lg hover:bg-gray-100 transition-colors">
              <span className="material-icons text-gray-500 text-xl">notifications_none</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200
                            rounded-lg px-3 py-1.5">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="material-icons text-white text-xs">person</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}