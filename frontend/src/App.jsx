import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import MainLayout from "./components/layouts/MainLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AcademicYearPage from "./pages/admin/AcademicYearPage";
import SubjectPage from "./pages/admin/SubjectPage";
import ClassroomPage from "./pages/admin/ClassroomPage";
import TeacherPage from "./pages/admin/TeacherPage";
import EnrollmentPage from "./pages/admin/EnrollmentPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AttendancePage from "./pages/teacher/AttendancePage";
import ScorePage from "./pages/teacher/ScorePage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendancePage from "./pages/student/AttendancePage";
import ReportCardPage from "./pages/student/ReportCardPage";
import Login from "./pages/Login";
import AssignmentPage from "./pages/admin/AssignmentPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="assignments" element={<AssignmentPage />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="academic-years" element={<AcademicYearPage />} />
          <Route path="subjects" element={<SubjectPage />} />
          <Route path="classrooms" element={<ClassroomPage />} />
          <Route path="teachers" element={<TeacherPage />} />
          <Route path="enrollment" element={<EnrollmentPage />} />
        </Route>

        {/* Teacher */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="scores" element={<ScorePage />} />
        </Route>

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["student"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendancePage />} />
          <Route path="report-card" element={<ReportCardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
