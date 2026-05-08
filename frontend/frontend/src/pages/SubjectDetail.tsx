import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import AssignStudentModal from "../components/subjects/AssignStudentModal";
import ScoreModal from "../components/subjects/ScoreModal";

type StudentScore = {
  id: number;
  first_name: string;
  last_name: string;
  average_score: number;
  grade: string;
};

type RawStudent = {
  id: number;
  first_name: string;
  last_name: string;
  scores?: { average_score: number; grade: string }[];
};

function SubjectDetail() {
  const { id } = useParams();

  const [students, setStudents] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);
  const [scoreStudent, setScoreStudent] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(`http://127.0.0.1:8000/api/subjects/${id}`);
      const json = await res.json();

      if (cancelled) return;

      const data = json.data.students.map((s: RawStudent) => {
        const score = s.scores?.[0];
        return {
          id: s.id,
          first_name: s.first_name,
          last_name: s.last_name,
          average_score: score?.average_score ?? 0,
          grade: score?.grade ?? "N/A",
        };
      });

      setStudents(data);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleCloseAssign() {
    setAssignOpen(false);
    // reload page ដើម្បី refresh data
    window.location.reload();
  }

  function handleCloseScore() {
    setScoreStudent(null);
    window.location.reload();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-xl font-bold mb-4">Subject Detail</h1>

        {/* ✅ ប៊ូតុង Assign Student */}
        <button
          onClick={() => setAssignOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Assign Student
        </button>

        {/* ✅ តារាង Students */}
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Average</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b hover:bg-slate-50">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.first_name} {s.last_name}</td>
                <td className="p-3">{s.average_score}</td>
                <td className="p-3">{s.grade}</td>
                <td className="p-3">
                  <button
                    onClick={() => setScoreStudent(s.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Input Score
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Modal Assign Student */}
        {assignOpen && (
          <AssignStudentModal
            subjectId={Number(id)}
            onClose={handleCloseAssign}
          />
        )}

        {/* ✅ Modal Input Score */}
        {scoreStudent !== null && (
          <ScoreModal
            studentId={scoreStudent}
            subjectId={Number(id)}
            onClose={handleCloseScore}
          />
        )}
      </main>
    </div>
  );
}

export default SubjectDetail;