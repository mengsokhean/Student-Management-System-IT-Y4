import { useEffect, useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import AddStudentModal from '../components/students/AddStudentModal'
import EditStudentModal from '../components/students/EditStudentModal'
import DeleteConfirmModal from '../components/students/DeleteConfirmModal'
import Toast from '../components/ui/Toast'
import type { Student } from '../types/student'
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../services/studentService'
import type { CreateStudentData, UpdateStudentData } from '../services/studentService'

function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Fetch
  useEffect(() => {
    async function load() {
      try {
        const data = await getStudents()
        setStudents(data)
      } catch {
        showToast('មិនអាចភ្ជាប់ API បានទេ', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Auto hide toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
  }

  // Create
  async function handleCreate(data: CreateStudentData) {
    try {
      const newStudent = await createStudent(data)
      setStudents((prev) => [...prev, newStudent])
      setIsAddOpen(false)
      showToast('បានបន្ថែមសិស្សដោយជោគជ័យ', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'បន្ថែមបានបរាជ័យ', 'error')
    }
  }

  // Update
  async function handleUpdate(id: number, data: UpdateStudentData) {
    try {
      const updated = await updateStudent(id, data)
      setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)))
      setEditingStudent(null)
      showToast('បានកែប្រែដោយជោគជ័យ', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'កែប្រែបានបរាជ័យ', 'error')
    }
  }

  // Delete
  async function handleDelete() {
    if (!deletingId) return
    try {
      await deleteStudent(deletingId)
      setStudents((prev) => prev.filter((s) => s.id !== deletingId))
      setDeletingId(null)
      showToast('បានលុបដោយជោគជ័យ', 'success')
    } catch {
      showToast('លុបបានបរាជ័យ', 'error')
    }
  }

  // Filter
  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.student_code.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 px-4 py-6">
      <div className="flex max-w-[1380px] gap-5">
        <Sidebar />

        <main className="min-w-0 flex-1">
          {/* Header */}
          <section className="mb-5 rounded-xl bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#1a3a52]">គ្រប់គ្រងសិស្ស</h1>
                <p className="mt-1 text-sm text-slate-500">
                  សិស្សទាំងអស់៖ {students.length} នាក់
                </p>
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-[#1a3a52] px-5 py-2.5 font-semibold text-white hover:bg-[#2d5a7b]"
              >
                <UserPlus size={18} />
                បន្ថែមសិស្ស
              </button>
            </div>
          </section>

          {/* Search */}
          <section className="mb-5 rounded-xl bg-white p-4 shadow-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="ស្វែងរកតាម ឈ្មោះ ឬ លេខកូដ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none focus:border-[#1a3a52]"
              />
            </div>
          </section>

          {/* Table */}
          <section className="rounded-xl bg-white p-6 shadow-md">
            {loading ? (
              <p className="text-center text-slate-400">កំពុងទាញទិន្នន័យ...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50 text-[#1a3a52]">
                      <th className="px-4 py-3">លេខ</th>
                      <th className="px-4 py-3">លេខកូដ</th>
                      <th className="px-4 py-3">ឈ្មោះ</th>
                      <th className="px-4 py-3">ភេទ</th>
                      <th className="px-4 py-3">ទូរស័ព្ទ</th>
                      <th className="px-4 py-3">ស្ថានភាព</th>
                      <th className="px-4 py-3 text-right">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, index) => (
                      <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-[#1a3a52]">{s.student_code}</td>
                        <td className="px-4 py-3 font-semibold">
                          {s.first_name} {s.last_name}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {s.gender === 'male' ? 'ប្រុស' : 'ស្រី'}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{s.phone ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              s.status === 'active'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {s.status === 'active' ? 'សកម្ម' : 'អសកម្ម'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setEditingStudent(s)}
                            className="mr-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          >
                            កែប្រែ
                          </button>
                          <button
                            onClick={() => setDeletingId(s.id)}
                            className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                          >
                            លុប
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <p className="mt-6 text-center text-slate-400">
                    {search ? 'រកមិនឃើញសិស្ស' : 'មិនទាន់មានសិស្សនៅឡើយ'}
                  </p>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modals */}
      {isAddOpen && (
        <AddStudentModal
          onClose={() => setIsAddOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdate={handleUpdate}
        />
      )}

      <DeleteConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default Students