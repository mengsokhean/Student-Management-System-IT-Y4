import type { Student } from "../../types/student";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

type Props = {
  students: Student[];
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  onEdit: (student: Student) => void;
};

function StudentTable({
  students,
  search,
  setSearch,
  onAdd,
  onDelete,
  onEdit,
}: Props) {
  const filteredStudents = students.filter((student) => {
    const fullName =
      `${student.first_name ?? ""} ${student.last_name ?? ""}`.toLowerCase();
    const studentCode = (student.student_code ?? "").toLowerCase();
    const keyword = search.toLowerCase();

    return fullName.includes(keyword) || studentCode.includes(keyword);
  });

  return (
    <section className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-xl font-bold text-[#1a3a52]">
            រាយបញ្ជីសិស្សថ្នាក់ទី 10 | Grade 10 Student List
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage student records from Laravel REST API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-72 rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52]/10"
              placeholder="ស្វែងរកឈ្មោះ ឬលេខកូដ..."
            />
          </div>

          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1a3a52] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d5a7b]"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-[15px]">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50 text-sm text-[#1a3a52]">
              <th className="px-5 py-4 font-semibold">ID</th>
              <th className="px-5 py-4 font-semibold">Student Code</th>
              <th className="px-5 py-4 font-semibold">Full Name</th>
              <th className="px-5 py-4 font-semibold">Gender</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Subjects</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                <td className="px-5 py-4 text-slate-700">#{student.id}</td>

                <td className="px-5 py-4 font-medium text-slate-800">
                  {student.student_code}
                </td>

                <td className="px-5 py-4 font-semibold text-slate-900">
                  {student.first_name} {student.last_name}
                </td>

                <td className="px-5 py-4 capitalize text-slate-700">
                  {student.gender}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {student.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {student.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {student.subjects.map((subject) => (
                        <span
                          key={subject.id}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {subject.subject_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">No subject</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(student.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-center text-slate-500">
          No students found.
        </p>
      )}
    </section>
  );
}

export default StudentTable;