import { useState } from "react";

type Props = {
  studentId: number;
  subjectId: number;
  onClose: () => void;
};

type ScoreForm = {
  assignment_score: string;
  midterm_score: string;
  final_score: string;
};

function ScoreModal({ studentId, subjectId, onClose }: Props) {
  const [form, setForm] = useState<ScoreForm>({
    assignment_score: "",
    midterm_score: "",
    final_score: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setError(null);

    if (!form.assignment_score || !form.midterm_score || !form.final_score) {
      setError("សូមបញ្ចូលពិន្ទុទាំងអស់!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/api/scores/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          subject_id: subjectId,
          assignment_score: Number(form.assignment_score),
          midterm_score: Number(form.midterm_score),
          final_score: Number(form.final_score),
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Save failed");

      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Save failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Input Score</h2>

        <div className="flex flex-col gap-3 mb-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Assignment Score</label>
            <input
              type="number"
              name="assignment_score"
              placeholder="0 - 100"
              value={form.assignment_score}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Midterm Score</label>
            <input
              type="number"
              name="midterm_score"
              placeholder="0 - 100"
              value={form.midterm_score}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Final Score</label>
            <input
              type="number"
              name="final_score"
              placeholder="0 - 100"
              value={form.final_score}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

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
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Score"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScoreModal;