import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage/HomePage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import { BookingFlowPage } from '../pages/BookingFlowPage/BookingFlowPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { DestinationCatalogPage } from '../pages/DestinationCatalogPage/DestinationCatalogPage';
import { DestinationDetailPage } from '../pages/DestinationDetailPage/DestinationDetailPage';
import { ArticlesPage } from '../pages/ArticlesPage/ArticlesPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage/ArticleDetailPage';
import { AboutGudauriPage } from '../pages/AboutGudauriPage/AboutGudauriPage';
import { ContactsPage } from '../pages/ContactsPage/ContactsPage';
import '../styles/page-polish.scss';

export default function App() {
  return (
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
  );
}
