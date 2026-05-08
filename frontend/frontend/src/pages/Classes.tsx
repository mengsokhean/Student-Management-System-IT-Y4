import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { createClass, deleteClass, getClasses } from "../services/classService";
import type { Class } from "../types/class";

function Classes() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [grade, setGrade] = useState(10);
  const [section, setSection] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleCreate() {
    if (!name.trim() || !section.trim()) return;

    const newClass = await createClass({
      class_name: name,
      grade,
      section,
    });

    setClasses((prev) => [...prev, newClass]);
    setName("");
    setSection("");
  }

  async function handleDelete(id: number) {
    const confirmed = confirm("Delete this class?");
    if (!confirmed) return;

    await deleteClass(id);
    setClasses((prev) => prev.filter((item) => item.id !== id));
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 px-4 py-6">
      <div className="flex max-w-[1380px] gap-5">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <section className="mb-5 rounded-xl bg-white p-6 shadow-md">
            <h1 className="text-2xl font-bold text-[#1a3a52]">
              Classes Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create classes and open a class to manage students inside it.
            </p>
          </section>

          <section className="mb-5 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-[#1a3a52]">
              Add New Class
            </h2>

            <div className="grid gap-3 md:grid-cols-[1fr_120px_120px_auto]">
              <input
                placeholder="Class name, e.g. Grade 10A"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-[#1a3a52]"
              />

              <input
                type="number"
                value={grade}
                onChange={(event) => setGrade(Number(event.target.value))}
                className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-[#1a3a52]"
              />

              <input
                placeholder="Section"
                value={section}
                onChange={(event) => setSection(event.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-[#1a3a52]"
              />

              <button
                onClick={handleCreate}
                className="rounded-lg bg-[#1a3a52] px-5 py-2 font-semibold text-white hover:bg-[#2d5a7b]"
              >
                Add
              </button>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-bold text-[#1a3a52]">
              Class List
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50 text-[#1a3a52]">
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Class</th>
                    <th className="px-5 py-4">Grade</th>
                    <th className="px-5 py-4">Section</th>
                    <th className="px-5 py-4">Students</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {classes.map((classItem) => (
                    <tr
                      key={classItem.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">#{classItem.id}</td>

                      <td
                        onClick={() => navigate(`/classes/${classItem.id}`)}
                        className="cursor-pointer px-5 py-4 font-semibold text-blue-600 hover:underline"
                      >
                        {classItem.class_name}
                      </td>

                      <td className="px-5 py-4">{classItem.grade}</td>
                      <td className="px-5 py-4">{classItem.section}</td>
                      <td className="px-5 py-4">
                        {classItem.students_count ?? 0}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDelete(classItem.id)}
                          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {classes.length === 0 && (
                <p className="mt-5 rounded-lg bg-slate-50 p-4 text-center text-slate-500">
                  No classes found.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Classes;