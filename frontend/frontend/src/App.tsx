import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Subjects from './pages/Subjects'
import Classes from './pages/Classes'
import SubjectDetail from './pages/SubjectDetail'
import ClassDetail from './pages/ClassDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/subjects" element={<Subjects />} />
      <Route path="/subjects/:id" element={<SubjectDetail />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/classes/:id" element={<ClassDetail />} />
    </Routes>
  )
}

export default App