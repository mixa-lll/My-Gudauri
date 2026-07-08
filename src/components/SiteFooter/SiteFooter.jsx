import { Link } from 'react-router-dom';
import { Container } from '../UI/Container/Container';
import './SiteFooter.scss';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__panel">
          <div className="site-footer__brand">My Gudauri</div>

          <div className="site-footer__links">
            <div>
              <h4>Sections</h4>
              <Link to="/instructors">Instructors</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/booking">Booking</Link>
              <Link to="/summary">Summary</Link>
            </div>

            <div>
              <h4>Contact</h4>
              <p>+995 123 45 65</p>
              <p>mygudauri@gmail.com</p>
              <p>Gudauri, Georgia</p>
            </div>
          </div>

          <p className="site-footer__legal">© 2026 MyGudauri, Inc. Privacy Policy</p>
        </div>
      </Container>
    </footer>
  );
}
