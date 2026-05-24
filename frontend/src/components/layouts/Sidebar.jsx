import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../lib/axios'

const adminMenu = [
  { path: '/admin/dashboard',      icon: 'dashboard',          label: 'ទំព័រដើម'       },
  { path: '/admin/academic-years', icon: 'event_note',         label: 'ឆ្នាំសិក្សា'     },
  { path: '/admin/classrooms',     icon: 'meeting_room',       label: 'ថ្នាក់រៀន'        },
  { path: '/admin/subjects',       icon: 'menu_book',          label: 'មុខវិជ្ជា'        },
  { path: '/admin/teachers',       icon: 'supervisor_account', label: 'គ្រូបង្រៀន'       },
  { path: '/admin/assignments',    icon: 'assignment_ind',     label: 'ចាត់តាំងគ្រូ'     },
  { path: '/admin/enrollment',     icon: 'how_to_reg',         label: 'ចុះឈ្មោះសិស្ស'   },
]

const teacherMenu = [
  { path: '/teacher/dashboard',  icon: 'dashboard',  label: 'ទំព័រដើម'    },
  { path: '/teacher/attendance', icon: 'fact_check', label: 'ចុះវត្តមាន'  },
  { path: '/teacher/scores',     icon: 'grade',      label: 'បញ្ចូលពិន្ទុ' },
]

const studentMenu = [
  { path: '/student/dashboard',   icon: 'dashboard',  label: 'ទំព័រដើម'     },
  { path: '/student/attendance',  icon: 'fact_check', label: 'វត្តមានខ្ញុំ'  },
  { path: '/student/report-card', icon: 'summarize',  label: 'សន្លឹកពិន្ទុ' },
]

const roleConfig = {
  admin:   { kh: 'អ្នកគ្រប់គ្រង', icon: 'admin_panel_settings', color: 'bg-purple-500' },
  teacher: { kh: 'គ្រូបង្រៀន',    icon: 'person',               color: 'bg-blue-500'   },
  student: { kh: 'សិស្ស',         icon: 'school',               color: 'bg-green-500'  },
}

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const menus = { admin: adminMenu, teacher: teacherMenu, student: studentMenu }
  const menu  = menus[user?.role] || []
  const role  = roleConfig[user?.role] || roleConfig.student

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch (_) {}
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col flex-shrink-0">

      {/* ── Brand ── */}
      <div className="px-4 py-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center
                          justify-center flex-shrink-0">
            <span className="material-icons text-white text-xl">school</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight truncate">
              វិទ្យាល័យហ៊ុនសែន
            </p>
            <p className="text-slate-400 text-xs truncate">ខេត្តព្រះសីហនុ</p>
          </div>
        </div>
      </div>

      {/* ── User ── */}
      <div className="px-4 py-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${role.color} rounded-lg flex items-center
                          justify-center flex-shrink-0`}>
            <span className="material-icons text-white text-lg">{role.icon}</span>
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs">{role.kh}</p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider
                      px-3 mb-2 mt-1">
          មុខងារ
        </p>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
            }
          >
            <span className="material-icons text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 py-3 border-t border-slate-700">
        <button onClick={handleLogout} className="w-full sidebar-link-inactive">
          <span className="material-icons text-xl text-red-400">logout</span>
          <span className="text-sm text-red-400">ចេញពីប្រព័ន្ធ</span>
        </button>
      </div>
    </aside>
  )
}