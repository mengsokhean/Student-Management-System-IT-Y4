import type { Class, ClassApiResponse } from "../types/class";

const API_URL = "http://127.0.0.1:8000/api";

export type CreateClassData = {
  class_name: string;
  grade: number;
  section: string;
};

export async function getClasses(): Promise<Class[]> {
  const res = await fetch(`${API_URL}/classes`);

  if (!res.ok) throw new Error("Failed to fetch classes");

  const result: ClassApiResponse = await res.json();
  return result.data;
}

export async function createClass(data: CreateClassData) {
  const res = await fetch(`${API_URL}/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message);
  return result.data;
}

export async function deleteClass(id: number) {
  const res = await fetch(`${API_URL}/classes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
}