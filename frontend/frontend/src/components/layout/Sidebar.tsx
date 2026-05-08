import {
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
const menuItems = [
  { label: 'ផ្ទាំងគ្រប់គ្រង', path: '/dashboard', icon: LayoutDashboard },
  { label: 'គ្រប់គ្រងសិស្ស', path: '/students', icon: Users },
  { label: 'មុខវិជ្ជា', path: '/subjects', icon: BookOpen },
  { label: 'ថ្នាក់រៀន', path: '/classes', icon: GraduationCap },
  { label: 'ពិន្ទុ', path: '/subjects', icon: Star },
  { label: 'វត្តមាន', path: '/dashboard', icon: CalendarDays },
  { label: 'របាយការណ៍', path: '/dashboard', icon: FileText },
  { label: 'ការកំណត់', path: '/dashboard', icon: Settings },
]

  return (
    <aside className="w-72 shrink-0 rounded-xl bg-[#1f425f] p-5 text-white shadow-xl">
      <div className="border-b-2 border-[#d4af37] pb-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
          <GraduationCap size={32} className="text-[#d4af37]" />
        </div>

        <h1 className="mt-3 text-base font-semibold">វិទ្យាល័យផ្កាយភ្នំ</h1>
        <p className="text-xs italic text-slate-200">Phnom Penh High School</p>
      </div>

      <div className="my-5 rounded-lg bg-white/10 p-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#d4af37]">
          <Users size={26} className="text-[#1a3a52]" />
        </div>

        <p className="mt-2 text-sm font-semibold">អ្នកគ្រប់គ្រង</p>
        <p className="text-xs text-slate-200">Admin</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm transition ${
                  isActive
                    ? "bg-[#d4af37] text-[#1a3a52]"
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;