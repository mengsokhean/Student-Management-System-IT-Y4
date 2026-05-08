import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (data: { subject_name: string }) => void;
};

function AddSubjectModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    onCreate({ subject_name: name });
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 className="mb-4 text-lg font-bold">Add Subject</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Subject name"
          className="w-full rounded border px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button className="px-3 py-1 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSubjectModal;