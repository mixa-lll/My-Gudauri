import { Link } from 'react-router-dom';
import { CONTACT_DETAILS } from '../../data/contactDetails';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../UI/Container/Container';
import './SiteFooter.scss';

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <Container width="wide">
        <div className="site-footer__top">
          <Link className="site-footer__brand" to="/" aria-label={t('nav.homeLabel')}>
            <span>My</span> Gudauri
          </Link>
          <p>{t('footer.tagline')}</p>
        </div>

        <div className="site-footer__main">
          <nav className="site-footer__column" aria-label={t('footer.services')}>
            <h4>{t('footer.services')}</h4>
            <Link to="/instructors">{t('footer.instructors')}</Link>
            <Link to="/activities">{t('footer.activities')}</Link>
            <Link to="/rental">{t('footer.rental')}</Link>
            <Link to="/transfers">{t('footer.transfers')}</Link>
            <Link to="/services">{t('footer.localServices')}</Link>
          </nav>

          <nav className="site-footer__column" aria-label={t('footer.explore')}>
            <h4>{t('footer.explore')}</h4>
            <Link to="/stays">{t('footer.stays')}</Link>
            <Link to="/places">{t('footer.places')}</Link>
            <Link to="/articles">{t('footer.articles')}</Link>
            <Link to="/about-gudauri">{t('footer.about')}</Link>
          </nav>

          <div className="site-footer__column site-footer__contact">
            <h4>{t('footer.contact')}</h4>
            <a href={`tel:${CONTACT_DETAILS.phoneHref}`}>{CONTACT_DETAILS.phoneDisplay}</a>
            <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>
            <p>{t('footer.location')}</p>
          </div>

          <div className="site-footer__cta">
            <p>{t('footer.professional')}</p>
            <a href={`mailto:${CONTACT_DETAILS.supportEmail}?subject=Offer%20a%20service`}>{t('footer.offer')} <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 My Gudauri</p>
          <div><Link to="/contacts">{t('footer.contacts')}</Link><span>{t('footer.privacy')}</span><span>{t('footer.cookies')}</span></div>
          <p>{t('footer.independent')}</p>
        </div>
      </Container>
    </footer>
  );
}
