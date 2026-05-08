export type Subject = {
  id: number
  subject_code: string
  subject_name: string
  credit: number
  description: string | null
}

export type Student = {
  id: number
  user_id: number
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
  subjects: Subject[]
}

export type StudentApiResponse = {
  success: boolean
  message: string
  data: Student[]
}
