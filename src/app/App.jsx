import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { HomePage } from '../pages/HomePage/HomePage';
import { InstructorsPage } from '../pages/InstructorsPage/InstructorsPage';
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import { BookingFlowPage } from '../pages/BookingFlowPage/BookingFlowPage';
import { SummaryPage } from '../pages/SummaryPage/SummaryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/instructors" element={<InstructorsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/booking" element={<BookingFlowPage />} />
      <Route element={<MainLayout />}>
        <Route path="/summary" element={<SummaryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
