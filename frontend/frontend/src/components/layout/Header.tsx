type Props = {
  onAddStudent: () => void
}

function Header({ onAddStudent }: Props) {
  return (
    <header className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Student Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Academic Year 2025 - 2026 • Semester 1
        </p>
      </div>

      <button
        onClick={onAddStudent}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + Add Student
      </button>
    </header>
  )
}

export default Header