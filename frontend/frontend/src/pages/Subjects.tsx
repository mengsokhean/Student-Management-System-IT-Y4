import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../services/subjectService";

import type { Subject } from "../types/subject";

import AddSubjectModal from "../components/subjects/AddSubjectModal";
import EditSubjectModal from "../components/subjects/EditSubjectModal";
import DeleteSubjectModal from "../components/subjects/DeleteSubjectModal";

function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ✅ FETCH
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ CREATE
  async function handleCreate(data: { subject_name: string }) {
    const newItem = await createSubject(data);
    setSubjects((prev) => [...prev, newItem]);
  }

  // ✅ UPDATE
  async function handleUpdate(id: number, data: { subject_name: string }) {
    const updated = await updateSubject(id, data);

    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? updated : s))
    );
  }

  // ✅ DELETE
  async function handleDelete() {
    if (!deletingId) return;

    await deleteSubject(deletingId);

    setSubjects((prev) => prev.filter((s) => s.id !== deletingId));
    setDeletingId(null);
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Subjects</h1>

          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Subject
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="py-3">ID</th>
                <th>Name</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-3">#{s.id}</td>
                  <td>{s.subject_name}</td>

                  <td className="text-right">
                    <button
                      onClick={() => setEditing(s)}
                      className="mr-2 border px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeletingId(s.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subjects.length === 0 && (
            <p className="text-center text-slate-400 mt-4">
              No subjects
            </p>
          )}
        </div>
      </main>

      {/* MODALS */}

      {isAddOpen && (
        <AddSubjectModal
          onClose={() => setIsAddOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {editing && (
        <EditSubjectModal
          subject={editing}
          onClose={() => setEditing(null)}
          onUpdate={handleUpdate}
        />
      )}

      <DeleteSubjectModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Subjects;