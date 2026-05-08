import type { Subject } from "../types/subject";

const API_URL = "http://127.0.0.1:8000/api";

export type CreateSubjectData = {
  subject_name: string;
};

// ✅ ទទួលបញ្ជី Subject ទាំងអស់
export async function getSubjects(): Promise<Subject[]> {
  const res = await fetch(`${API_URL}/subjects`);

  if (!res.ok) throw new Error("Failed to fetch");

  const result = await res.json();

  return result.data;
}

// ✅ បង្កើត Subject ថ្មី
export async function createSubject(data: CreateSubjectData) {
  const res = await fetch(`${API_URL}/subjects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result.data;
}

// ✅ កែប្រែ Subject
export async function updateSubject(id: number, data: CreateSubjectData) {
  const res = await fetch(`${API_URL}/subjects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);

  return result.data;
}

// ✅ លុប Subject
export async function deleteSubject(id: number) {
  const res = await fetch(`${API_URL}/subjects/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
}

// ✅ ចុះឈ្មោះសិស្សចូល Subject (Enroll)
export async function assignStudent(student_id: number, subject_id: number) {
  const res = await fetch(`${API_URL}/enroll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ student_id, subject_id }),
  });

  if (!res.ok) throw new Error("Assign failed");

  return res.json();
}