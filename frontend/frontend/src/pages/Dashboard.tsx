import { useEffect, useState } from 'react'
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import { getStudents } from '../services/studentService'
import { getSubjects } from '../services/subjectService'
import { getClasses } from '../services/classService'

function Dashboard() {
  const [studentCount, setStudentCount] = useState(0)
  const [subjectCount, setSubjectCount] = useState(0)
  const [classCount, setClassCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [students, subjects, classes] = await Promise.all([
          getStudents(),
          getSubjects(),
          getClasses(),
        ])
        setStudentCount(students.length)
        setSubjectCount(subjects.length)
        setClassCount(classes.length)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    {
      label: 'សិស្សទាំងអស់',
      value: studentCount,
      icon: Users,
      color: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'មុខវិជ្ជា',
      value: subjectCount,
      icon: BookOpen,
      color: 'bg-green-500',
      light: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      label: 'ថ្នាក់រៀន',
      value: classCount,
      icon: GraduationCap,
      color: 'bg-yellow-500',
      light: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
    {
      label: 'ឆ្នាំសិក្សា',
      value: '2025–2026',
      icon: TrendingUp,
      color: 'bg-purple-500',
      light: 'bg-purple-50',
      text: 'text-purple-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 px-4 py-6">
      <div className="flex max-w-[1380px] gap-5">
        <Sidebar />

        <main className="min-w-0 flex-1">
          {/* Header */}
          <section className="mb-6 rounded-xl bg-white p-6 shadow-md">
            <h1 className="text-2xl font-bold text-[#1a3a52]">ផ្ទាំងគ្រប់គ្រង</h1>
            <p className="mt-1 text-sm text-slate-500">
              វិទ្យាល័យផ្កាយភ្នំ — ព័ត៌មានទូទៅប្រចាំថ្ងៃ
            </p>
          </section>

          {/* Stats */}
          {loading ? (
            <div className="rounded-xl bg-white p-6 text-center text-slate-400 shadow-md">
              កំពុងទាញទិន្នន័យ...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white p-6 shadow-md"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${stat.light}`}>
                      <Icon size={24} className={stat.text} />
                    </div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-[#1a3a52]">
                      {stat.value}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Welcome */}
          <section className="mt-6 rounded-xl bg-[#1f425f] p-6 text-white shadow-md">
            <h2 className="text-lg font-bold">សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ</h2>
            <p className="mt-2 text-sm text-slate-300">
              ប្រើ Sidebar ខាងឆ្វេងដើម្បីគ្រប់គ្រងសិស្ស មុខវិជ្ជា និងថ្នាក់រៀន។
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard