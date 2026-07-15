import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { MediaPlaceholder } from '../../components/MediaPlaceholder/MediaPlaceholder';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { Container } from '../../components/UI/Container/Container';
import { getDestination, getDestinationItem } from '../../data/destinations';
import './DestinationDetailPage.scss';

export function DestinationDetailPage() {
  const { section, slug } = useParams();
  const config = getDestination(section);
  const item = getDestinationItem(section, slug);
  const [quantity, setQuantity] = useState(2);

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
              <div className="destination-detail__badges"><span>{item.category}</span><span>{config.navTitle}</span></div>
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
                <p className="destination-eyebrow">About this offer</p>
                <h2>Everything you need for a smooth Gudauri day</h2>
                <p className="destination-detail__description">{item.description}</p>
              </section>

              <section className="destination-detail__section">
                <p className="destination-eyebrow">Included</p>
                <h2>What is included</h2>
                <div className="destination-detail__included">
                  {item.included.map((included) => <span key={included}><i aria-hidden="true">✓</i>{included}</span>)}
                </div>
              </section>

              <section className="destination-detail__notice">
                <span aria-hidden="true">i</span>
                <div><strong>Availability is checked before payment</strong><p>Send the request first. Our booking manager will confirm the details and share a secure payment link.</p></div>
              </section>
            </div>

            <aside className="destination-booking-card" aria-label="Booking summary">
              <div className="destination-booking-card__provider">
                <MediaPlaceholder label={item.name} compact />
                <div><span>{config.navTitle}</span><strong>{item.name}</strong></div>
              </div>
              <div className="destination-booking-card__body">
                <div className="destination-booking-card__price"><strong>{item.price}</strong><span>{item.priceSuffix}</span></div>
                <label>Date <button type="button">Choose date <span aria-hidden="true">⌄</span></button></label>
                <label>Guests / quantity
                  <div className="destination-booking-card__stepper">
                    <strong>{quantity}</strong>
                    <div><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>−</button><button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => current + 1)}>+</button></div>
                  </div>
                </label>
                <Link className="destination-booking-card__cta" to={`/booking?type=${section}&offer=${slug}`}>Request booking <span aria-hidden="true">→</span></Link>
                <p>No payment now. We confirm availability first.</p>
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
