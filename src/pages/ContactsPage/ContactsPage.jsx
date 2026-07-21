import { useEffect } from 'react';
import { CONTACT_DETAILS } from '../../data/contactDetails';
import { Badge, Container, ContentPageHero, SiteFooter, SiteNavbar } from '../../design-system';
import { useLanguage } from '../../i18n/LanguageContext';
import './ContactsPage.scss';

export function ContactsPage() {
  const { language, t } = useLanguage();

  useEffect(() => {
    document.title = t('contacts.pageTitle');
  }, [language, t]);

  const detailRows = [
    ['brandLabel', 'brandValue'],
    ['formatLabel', 'formatValue'],
    ['regionLabel', 'regionValue']
  ];

  const trustCards = [
    ['01', 'verifiedTitle', 'verifiedText'],
    ['02', 'directTitle', 'directText'],
    ['03', 'localTitle', 'localText']
  ];

  return (
    <div className="contacts-page">
      <SiteNavbar className="contacts-nav-host" />
      <main>
        <Container width="wide">
          <ContentPageHero
            kicker={t('contacts.kicker')}
            title={t('contacts.title')}
            titleId="contacts-title"
            description={t('contacts.intro')}
            status={<Badge tone="success"><span className="contacts-status-dot" aria-hidden="true" />{t('contacts.status')}</Badge>}
          />

          <section className="contacts-methods" aria-label={t('footer.contact')}>
            <a href={`mailto:${CONTACT_DETAILS.email}`}>
              <span className="contacts-methods__mark" aria-hidden="true">@</span>
              <span className="contacts-methods__copy">
                <span>{t('contacts.emailTitle')}</span>
                <strong>{CONTACT_DETAILS.email}</strong>
                <small>{t('contacts.emailNote')}</small>
              </span>
              <span className="contacts-methods__arrow" aria-hidden="true">↗</span>
            </a>
            <a href={`tel:${CONTACT_DETAILS.phoneHref}`}>
              <span className="contacts-methods__mark" aria-hidden="true">T</span>
              <span className="contacts-methods__copy">
                <span>{t('contacts.phoneTitle')}</span>
                <strong>{CONTACT_DETAILS.phoneDisplay}</strong>
                <small>{t('contacts.phoneNote')}</small>
              </span>
              <span className="contacts-methods__arrow" aria-hidden="true">↗</span>
            </a>
            <div>
              <span className="contacts-methods__mark" aria-hidden="true">⌖</span>
              <span className="contacts-methods__copy">
                <span>{t('contacts.locationTitle')}</span>
                <strong>{t('footer.location')}</strong>
                <small>{t('contacts.locationNote')}</small>
              </span>
            </div>
          </section>

          <section className="contacts-details" aria-labelledby="contacts-details-title">
            <header className="contacts-section-heading">
              <p className="contacts-kicker">{t('contacts.detailsKicker')}</p>
              <h2 id="contacts-details-title">{t('contacts.detailsTitle')}</h2>
              <p>{t('contacts.detailsText')}</p>
            </header>
            <dl>
              {detailRows.map(([label, value]) => (
                <div key={label}>
                  <dt>{t(`contacts.${label}`)}</dt>
                  <dd>{t(`contacts.${value}`)}</dd>
                </div>
              ))}
              <div>
                <dt>{t('contacts.legalLabel')}</dt>
                <dd>
                  <a href={`mailto:${CONTACT_DETAILS.email}?subject=Official%20company%20details`}>
                    {t('contacts.legalValue')} <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <section className="contacts-trust" aria-labelledby="contacts-trust-title">
            <header className="contacts-section-heading contacts-section-heading--light">
              <p className="contacts-kicker">{t('contacts.trustKicker')}</p>
              <h2 id="contacts-trust-title">{t('contacts.trustTitle')}</h2>
            </header>
            <div className="contacts-trust__grid">
              {trustCards.map(([number, title, text]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{t(`contacts.${title}`)}</h3>
                  <p>{t(`contacts.${text}`)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="contacts-response">
            <div>
              <p className="contacts-kicker">{t('contacts.responseKicker')}</p>
              <h2>{t('contacts.responseTitle')}</h2>
              <p>{t('contacts.responseText')}</p>
            </div>
            <a href={`mailto:${CONTACT_DETAILS.email}?subject=My%20Gudauri%20support`}>
              {t('contacts.write')} <span aria-hidden="true">↗</span>
            </a>
          </section>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
