import { Outlet } from 'react-router-dom';
import { SiteNavbar } from '../../SiteNavbar/SiteNavbar';
import { SiteFooter } from '../../SiteFooter/SiteFooter';
import './MainLayout.scss';

export function MainLayout() {
  return (
    <div className="app-shell">
      <SiteNavbar />
      <main className="app-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
