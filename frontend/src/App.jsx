import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public Layout & Pages — THIS IS ALL REACT HANDLES
import PublicLayout      from './components/layouts/PublicLayout'
import HomePage          from './pages/public/HomePage'
import AboutPage         from './pages/public/AboutPage'
import ContactPage       from './pages/public/ContactPage'
import ResultSearchPage  from './pages/public/ResultSearchPage'
import ResultDisplayPage from './pages/public/ResultDisplayPage'
import NewsPage          from './pages/public/NewsPage'
import AnnouncementsPage from './pages/public/AnnouncementsPage'
import ArticleDetailPage from './pages/public/ArticleDetailPage'

// Admin Stub Pages
import StudentsStubPage from './pages/admin/StudentsStubPage'
import TeachersStubPage from './pages/admin/TeachersStubPage'
import ClassesStubPage from './pages/admin/ClassesStubPage'
import AttendancePage from './pages/admin/AttendancePage'

/*
 * ─────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE NOTE
 * ─────────────────────────────────────────────────────────────────────────
 * React ONLY handles the PUBLIC website.
 *
 * Admin Portal  → /admin/login, /admin/dashboard  (Laravel Blade SSR)
 * Teacher Portal → /teacher/login, /teacher/dashboard (Laravel Blade SSR)
 *
 * Do NOT add Admin or Teacher routes here.
 * ─────────────────────────────────────────────────────────────────────────
 */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ══ PUBLIC WEBSITE (React SPA) ══ */}
        <Route path="/" element={<PublicLayout />}>
          <Route index               element={<HomePage />} />
          <Route path="about"        element={<AboutPage />} />
          <Route path="news"         element={<NewsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="contact"      element={<ContactPage />} />
          <Route path="results"      element={<ResultSearchPage />} />
          <Route path="results/view" element={<ResultDisplayPage />} />
          <Route path="article/:slug" element={<ArticleDetailPage />} />
        </Route>

        {/* ══ ADMIN STUBS (React SPA placeholders) ══ */}
        <Route path="/admin">
          <Route path="students" element={<StudentsStubPage />} />
          <Route path="teachers" element={<TeachersStubPage />} />
          <Route path="classes"  element={<ClassesStubPage />} />
          <Route path="attendance" element={<AttendancePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}