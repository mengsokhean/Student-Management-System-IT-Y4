export type Class = {
  id: number;
  class_name: string;
  grade: number;
  section: string;
  teacher_name?: string;
  students_count?: number;
};

export type ClassApiResponse = {
  data: Class[];
};