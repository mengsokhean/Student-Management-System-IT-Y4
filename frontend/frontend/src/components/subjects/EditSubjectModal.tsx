import { useState } from "react";

type Props = {
  subject: { id: number; subject_name: string };
  onClose: () => void;
  onUpdate: (id: number, data: { subject_name: string }) => void;
};

function EditSubjectModal({ subject, onClose, onUpdate }: Props) {
  const [name, setName] = useState(subject.subject_name);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onUpdate(subject.id, { subject_name: name });
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <form className="w-[400px] rounded-xl bg-white p-6 shadow-lg" onSubmit={handleSubmit}>
        <h2 className="mb-4 text-lg font-bold">Edit Subject</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border px-3 py-1 rounded">
            Cancel
          </button>

          <button className="bg-green-600 text-white px-3 py-1 rounded">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSubjectModal;