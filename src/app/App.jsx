import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { HomePage } from '../pages/HomePage/HomePage';
import { InstructorsPage } from '../pages/InstructorsPage/InstructorsPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import { BookingFlowPage } from '../pages/BookingFlowPage/BookingFlowPage';
import { SummaryPage } from '../pages/SummaryPage/SummaryPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { DestinationCatalogPage } from '../pages/DestinationCatalogPage/DestinationCatalogPage';
import { DestinationDetailPage } from '../pages/DestinationDetailPage/DestinationDetailPage';
import { ArticlesPage } from '../pages/ArticlesPage/ArticlesPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage/ArticleDetailPage';
import { AboutGudauriPage } from '../pages/AboutGudauriPage/AboutGudauriPage';
import '../styles/page-polish.scss';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/instructors" element={<InstructorsPage />} />
      <Route path="/instructors/:slug" element={<ProfilePage />} />
      <Route path="/profile" element={<Navigate to="/instructors/mikhail" replace />} />
      <Route path="/booking" element={<BookingFlowPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticleDetailPage />} />
      <Route path="/about-gudauri" element={<AboutGudauriPage />} />
      <Route path="/:section" element={<DestinationCatalogPage />} />
      <Route path="/:section/:slug" element={<DestinationDetailPage />} />
      <Route element={<MainLayout />}>
        <Route path="/summary" element={<SummaryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
