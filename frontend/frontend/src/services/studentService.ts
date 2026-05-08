import type { Student, StudentApiResponse } from '../types/student'

const API_URL = 'http://127.0.0.1:8000/api'

export type CreateStudentData = {
  name: string
  email: string
  password: string
  class_id: number | null
  student_code: string
  first_name: string
  last_name: string
  gender: string
  date_of_birth: string | null
  phone: string | null
  address: string | null
  status: string
}

export type UpdateStudentData = {
  class_id: number | null
  student_code: string
  first_name: string
  last_name: string
  gender: string
  date_of_birth: string | null
  email: string | null
  phone: string | null
  address: string | null
  status: string
}

export async function getStudents(): Promise<Student[]> {
  const res = await fetch(`${API_URL}/students`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to fetch students')
  const result: StudentApiResponse = await res.json()
  return result.data
}

export async function createStudent(data: CreateStudentData): Promise<Student> {
  const res = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || 'Failed to create student')
  return result.data
}

export async function updateStudent(id: number, data: UpdateStudentData): Promise<Student> {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || 'Failed to update student')
  return result.data
}

export async function deleteStudent(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to delete student')
}