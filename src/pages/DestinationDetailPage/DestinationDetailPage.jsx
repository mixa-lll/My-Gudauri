import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { MediaPlaceholder } from '../../components/MediaPlaceholder/MediaPlaceholder';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { Container } from '../../components/UI/Container/Container';
import { SectionHeading } from '../../components/UI/SectionHeading/SectionHeading';
import { Pill } from '../../components/UI/Pill/Pill';
import { getDestination, getDestinationItem } from '../../data/destinations';
import './DestinationDetailPage.scss';

export function DestinationDetailPage() {
  const { section, slug } = useParams();
  const config = getDestination(section);
  const item = getDestinationItem(section, slug);

  useEffect(() => {
    document.body.classList.add('destination-detail-body');
    if (item) document.title = `${item.name} — My Gudauri`;
    return () => document.body.classList.remove('destination-detail-body');
  }, [item]);

  if (!config || !item) {
    return (
      <main className="destination-detail-state">
        <h1>Page not found</h1>
        <Link to={config ? `/${section}` : '/'}>Back to catalogue</Link>
      </main>
    );
  }

  const gallery = [item.name, ...item.included.slice(0, 4)];

  return (
    <div className={`destination-detail destination-page--${config.accent}`}>
      <SiteNavbar className="destination-nav-host" />

      <main>
        <Container className="destination-shell">
          <Link className="destination-detail__back" to={`/${section}`}>← Back to {config.navTitle.toLowerCase()}</Link>

          <header className="destination-detail__header">
            <div>
              <div className="destination-detail__badges">
                <Pill size="sm" tone="light">{item.category}</Pill>
                <Pill size="sm" tone="dark">{config.navTitle}</Pill>
              </div>
              <h1>{item.name}</h1>
            </div>
            <div className="destination-detail__rating"><strong>★ {item.rating}</strong><span>{item.reviews}</span></div>
          </header>

          <section className="destination-gallery" aria-label={`${item.name} gallery`}>
            <div className="destination-gallery__main"><MediaPlaceholder label={gallery[0]} /></div>
            {gallery.slice(1, 5).map((label, index) => <div key={`${label}-${index}`}><MediaPlaceholder label={label} /></div>)}
          </section>

          <div className="destination-detail__layout">
            <div className="destination-detail__content">
              <section className="destination-detail__facts" aria-label="Key details">
                {item.facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
              </section>

              <section className="destination-detail__section">
                <SectionHeading size="md" kicker="Offer details" title="Everything you need for a smooth Gudauri day" />
                <p className="destination-detail__description">{item.description}</p>
              </section>

              <section className="destination-detail__section">
                <SectionHeading size="md" kicker="Included essentials" title="What is included" />
                <div className="destination-detail__included">
                  {item.included.map((included) => <span key={included}><i aria-hidden="true">✓</i>{included}</span>)}
                </div>
              </section>

              <section className="destination-detail__notice">
                <span aria-hidden="true">i</span>
                <div><strong>Availability changes throughout the season</strong><p>Ask our local team to confirm current details before making plans around this offer.</p></div>
              </section>
            </div>

            <aside className="destination-booking-card" aria-label="Offer inquiry">
              <div className="destination-booking-card__provider">
                <MediaPlaceholder label={item.name} compact />
                <div><span>{config.navTitle}</span><strong>{item.name}</strong></div>
              </div>
              <div className="destination-booking-card__body">
                <div className="destination-booking-card__price"><strong>{item.price}</strong><span>{item.priceSuffix}</span></div>
                <p>Online booking is currently available for instructor lessons only. Ask our local team about this offer and current availability.</p>
                <a
                  className="destination-booking-card__cta"
                  href={`mailto:support@mygudauri.com?subject=${encodeURIComponent(`Inquiry: ${item.name}`)}`}
                >
                  Ask about availability <span aria-hidden="true">→</span>
                </a>
              </div>
            </aside>
          </div>

          <section className="destination-detail__faq"><FaqAccordion items={config.faq} /></section>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
