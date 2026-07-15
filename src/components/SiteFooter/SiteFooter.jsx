import { Link } from 'react-router-dom';
import { Container } from '../UI/Container/Container';
import './SiteFooter.scss';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer__container">
        <div className="site-footer__top">
          <Link className="site-footer__brand" to="/" aria-label="My Gudauri home">
            <span>My</span> Gudauri
          </Link>
          <p>One trusted local guide for instructors, mountain experiences, stays and everything around Gudauri.</p>
        </div>

        <div className="site-footer__main">
          <nav className="site-footer__column" aria-label="Services">
            <h4>Services</h4>
            <Link to="/instructors">Instructors</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/rental">Rental</Link>
            <Link to="/transfers">Transfers</Link>
            <Link to="/services">Local services</Link>
          </nav>

          <nav className="site-footer__column" aria-label="Explore Gudauri">
            <h4>Explore</h4>
            <Link to="/stays">Stays</Link>
            <Link to="/places">Places</Link>
            <Link to="/articles">Articles</Link>
            <Link to="/about-gudauri">About Gudauri</Link>
          </nav>

          <div className="site-footer__column site-footer__contact">
            <h4>Contact</h4>
            <a href="tel:+9951234565">+995 123 45 65</a>
            <a href="mailto:mygudauri@gmail.com">mygudauri@gmail.com</a>
            <p>Gudauri, Georgia</p>
          </div>

          <div className="site-footer__cta">
            <p>Are you a local professional?</p>
            <Link to="/summary">Offer a service <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 My Gudauri</p>
          <div><a href="mailto:mygudauri@gmail.com">Support</a><span>Privacy</span><span>Cookies</span></div>
          <p>Independent local platform</p>
        </div>
      </Container>
    </footer>
  );
}
