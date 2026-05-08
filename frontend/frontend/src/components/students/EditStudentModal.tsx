import { useState } from 'react'
import type { Student } from '../../types/student'
import type { UpdateStudentData } from '../../services/studentService'

type Props = {
  student: Student
  onClose: () => void
  onUpdate: (id: number, data: UpdateStudentData) => Promise<void>
}

function EditStudentModal({ student, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<UpdateStudentData>({
    class_id: student.class_id,
    student_code: student.student_code,
    first_name: student.first_name,
    last_name: student.last_name,
    gender: student.gender,
    date_of_birth: student.date_of_birth ?? '',
    email: student.email ?? '',
    phone: student.phone ?? '',
    address: student.address ?? '',
    status: student.status,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field: keyof UpdateStudentData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'class_id' ? (value === '' ? null : Number(value)) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onUpdate(student.id, {
        ...form,
        date_of_birth: form.date_of_birth || null,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Edit Student</h2>
          <p className="mt-1 text-sm text-slate-500">Update student profile information.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Student Code</label>
              <input
                value={form.student_code}
                onChange={(e) => updateField('student_code', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">First Name</label>
              <input
                value={form.first_name}
                onChange={(e) => updateField('first_name', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Last Name</label>
              <input
                value={form.last_name}
                onChange={(e) => updateField('last_name', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                value={form.date_of_birth ?? ''}
                onChange={(e) => updateField('date_of_birth', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email ?? ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
              <input
                value={form.phone ?? ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
              <textarea
                value={form.address ?? ''}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStudentModal