import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import type { Student } from "../types/student";
import { getStudents, updateStudent } from "../services/studentService";

type ClassStudent = {
  id: number;
  first_name: string;
  last_name: string;
  student_code: string;
  user_id: number;
  class_id: number | null;
  gender: string;
  date_of_birth: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
};

type ClassDetailType = {
  id: number;
  class_name: string;
  grade: number;
  section: string;
  students: ClassStudent[];
};

function ClassDetail() {
  const { id } = useParams();

  const classId = Number(id);

  const [classData, setClassData] = useState<ClassDetailType | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const classResponse = await fetch(
          `http://127.0.0.1:8000/api/classes/${classId}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const classResult = await classResponse.json();

        const students = await getStudents();

        setClassData(classResult.data);
        setAllStudents(students);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [classId]);

 async function handleAssignStudent() {
  if (!selectedStudentId || !classData) return

  const student = allStudents.find((item) => item.id === Number(selectedStudentId))
  if (!student) return

  setSaving(true)
  try {
    const updatedStudent = await updateStudent(student.id, {
      class_id: classData.id,
      student_code: student.student_code,
      first_name: student.first_name,
      last_name: student.last_name,
      gender: student.gender,
      date_of_birth: student.date_of_birth,
      email: student.email,
      phone: student.phone,
      address: student.address,
      status: student.status,
    })

    setClassData((prev) => {
      if (!prev) return prev
      const alreadyExists = prev.students.some((item) => item.id === updatedStudent.id)
      if (alreadyExists) return prev
      return { ...prev, students: [...prev.students, updatedStudent] }
    })

    setAllStudents((prev) =>
      prev.map((item) => (item.id === updatedStudent.id ? updatedStudent : item))
    )
    setSelectedStudentId('')
  } catch (error) {
    console.error(error)
    alert('Assign student failed')
  } finally {
    setSaving(false)
  }
}

async function handleRemoveFromClass(student: ClassStudent) {
  if (!confirm('Remove this student from this class?')) return

  setSaving(true)
  try {
    const updatedStudent = await updateStudent(student.id, {
      class_id: null,
      student_code: student.student_code,
      first_name: student.first_name,
      last_name: student.last_name,
      gender: student.gender,
      date_of_birth: student.date_of_birth,
      email: student.email,
      phone: student.phone,
      address: student.address,
      status: student.status,
    })

    setClassData((prev) => {
      if (!prev) return prev
      return { ...prev, students: prev.students.filter((item) => item.id !== student.id) }
    })

    setAllStudents((prev) =>
      prev.map((item) => (item.id === updatedStudent.id ? updatedStudent : item))
    )
  } catch (error) {
    console.error(error)
    alert('Remove student failed')
  } finally {
    setSaving(false)
  }
}

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!classData) {
    return <div className="p-6">Class not found</div>;
  }

  const availableStudents = allStudents.filter(
    (student) => student.class_id !== classData.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 px-4 py-6">
      <div className="flex max-w-[1380px] gap-5">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <section className="mb-5 rounded-xl bg-white p-6 shadow-md">
            <h1 className="text-2xl font-bold text-[#1a3a52]">
              {classData.class_name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Grade {classData.grade} • Section {classData.section}
            </p>
          </section>

          <section className="mb-5 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <h3 className="text-2xl font-bold text-[#1a3a52]">
                {classData.students.length}
              </h3>
              <p className="mt-1 text-xs text-slate-500">STUDENTS IN CLASS</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <h3 className="text-2xl font-bold text-[#1a3a52]">
                {availableStudents.length}
              </h3>
              <p className="mt-1 text-xs text-slate-500">AVAILABLE STUDENTS</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <h3 className="text-2xl font-bold text-[#1a3a52]">
                2025 - 2026
              </h3>
              <p className="mt-1 text-xs text-slate-500">ACADEMIC YEAR</p>
            </div>
          </section>

          <section className="mb-5 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-[#1a3a52]">
              Assign Student to Class
            </h2>

            <div className="flex gap-3">
              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-[#1a3a52]"
              >
                <option value="">Select student</option>

                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_code} - {student.first_name}{" "}
                    {student.last_name}
                    {student.class_id ? " (Move from other class)" : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignStudent}
                disabled={saving || !selectedStudentId}
                className="rounded-lg bg-[#1a3a52] px-5 py-2 font-semibold text-white hover:bg-[#2d5a7b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Assign"}
              </button>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-[#1a3a52]">
              Students in this Class
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50 text-[#1a3a52]">
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Code</th>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Gender</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {classData.students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">#{student.id}</td>
                      <td className="px-5 py-4 font-medium">
                        {student.student_code}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-5 py-4 capitalize">
                        {student.gender}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleRemoveFromClass(student)}
                          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {classData.students.length === 0 && (
                <p className="mt-5 rounded-lg bg-slate-50 p-4 text-center text-slate-500">
                  No students in this class.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ClassDetail;