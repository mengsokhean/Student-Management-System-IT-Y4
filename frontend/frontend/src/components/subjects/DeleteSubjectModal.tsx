type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteSubjectModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="w-[350px] rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-red-600">
          Delete Subject
        </h2>

        <p className="mb-4 text-sm text-slate-600">
          Are you sure you want to delete this subject?
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-3 py-1 rounded">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSubjectModal;