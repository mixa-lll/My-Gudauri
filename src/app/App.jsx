import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import '../styles/page-polish.scss';

function lazyPage(importPage, exportName) {
  return lazy(() => importPage().then((module) => ({ default: module[exportName] })));
}

const HomePage = lazyPage(() => import('../pages/HomePage/HomePage'), 'HomePage');
const ProfilePage = lazyPage(() => import('../pages/ProfilePage/ProfilePage'), 'ProfilePage');
const BookingFlowPage = lazyPage(() => import('../pages/BookingFlowPage/BookingFlowPage'), 'BookingFlowPage');
const AdminPage = lazyPage(() => import('../pages/AdminPage/AdminPage'), 'AdminPage');
const DestinationCatalogPage = lazyPage(() => import('../pages/DestinationCatalogPage/DestinationCatalogPage'), 'DestinationCatalogPage');
const DestinationDetailPage = lazyPage(() => import('../pages/DestinationDetailPage/DestinationDetailPage'), 'DestinationDetailPage');
const ArticlesPage = lazyPage(() => import('../pages/ArticlesPage/ArticlesPage'), 'ArticlesPage');
const ArticleDetailPage = lazyPage(() => import('../pages/ArticleDetailPage/ArticleDetailPage'), 'ArticleDetailPage');
const AboutGudauriPage = lazyPage(() => import('../pages/AboutGudauriPage/AboutGudauriPage'), 'AboutGudauriPage');
const ContactsPage = lazyPage(() => import('../pages/ContactsPage/ContactsPage'), 'ContactsPage');

export default function App() {
  return (
    <Suspense fallback={<main className="app-route-loading" aria-live="polite">Loading…</main>}>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/instructors" element={<DestinationCatalogPage section="instructors" />} />
      <Route path="/instructors/:slug" element={<ProfilePage />} />
      <Route path="/profile" element={<Navigate to="/instructors/mikhail" replace />} />
      <Route path="/booking" element={<BookingFlowPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticleDetailPage />} />
      <Route path="/about-gudauri" element={<AboutGudauriPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/:section" element={<DestinationCatalogPage />} />
      <Route path="/:section/:slug" element={<DestinationDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
