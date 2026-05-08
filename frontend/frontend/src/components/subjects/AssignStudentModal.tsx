import { useState } from "react";
import { assignStudent } from "../../services/subjectService";

type Props = {
  subjectId: number;
  onClose: () => void;
};

function AssignStudentModal({ subjectId, onClose }: Props) {
  const [studentId, setStudentId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    setError(null);

    if (!studentId) {
      setError("សូមបញ្ចូល Student ID!");
      return;
    }

    try {
      setLoading(true);
      await assignStudent(Number(studentId), subjectId);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Assign failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Assign Student</h2>

        <input
          type="number"
          placeholder="បញ្ចូល Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignStudentModal;