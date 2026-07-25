import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Container, FaqAccordion, InstructorCard, SectionHeading, SiteFooter, SiteNavbar } from '../../design-system';
import { HomeHeroSearch } from '../../components/product';
import { HOME_CATEGORIES } from '../../data/siteCategories';
import { useLanguage } from '../../i18n/LanguageContext';
import { getInstructors } from '../../services/instructorsApi';
import './HomePage.scss';

export function HomePage() {
  const { t, tList } = useLanguage();
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    document.body.classList.add('home-page-body');
    return () => {
      document.body.classList.remove('home-page-body');
    };
  }, []);

  useEffect(() => {
    let active = true;
    getInstructors().then((items) => {
      if (active) setInstructors(items.slice(0, 3));
    }).catch(() => {
      if (active) setInstructors([]);
    });
    return () => { active = false; };
  }, []);

  return (
    <>
      <div className="home-page">
        <div className="home-page__nav-band">
          <SiteNavbar className="site-nav-host--hero" />
        </div>
        <section className="hero-wrap">
          <Container width="wide">
            <div className="grid-12 hero-grid">
              <div className="hero-inner">
                <div className="hero-media" aria-hidden="true">
                  <img src="/assets/design-1/hero-gudauri-panorama.jpg" alt="" />
                </div>

                <div className="hero-content">
                  <div className="hero-meta-pills" aria-label={t('home.heroContextLabel')}>
                    <Badge size="sm" mediaOverlay>{t('home.heroBadgeLocal')}</Badge>
                    <Badge size="sm" mediaOverlay>{t('home.heroBadgeSeason')}</Badge>
                  </div>
                  <h1 className="hero-title-main">MY GUDAURI</h1>
                  <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
                  <HomeHeroSearch />
                </div>

                <Link className="hero-about-link" to="/about-gudauri">
                  <span className="hero-about-link__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="m3.5 5.5 5-2 7 2.5 5-2v14.5l-5 2-7-2.5-5 2V5.5Z" />
                      <path d="M8.5 3.5V18m7-12v14.5" />
                    </svg>
                  </span>
                  <span className="hero-about-link__copy">
                    <strong>{t('home.aboutLinkTitle')}</strong>
                    <small>{t('home.aboutLinkNote')}</small>
                  </span>
                  <span className="hero-about-link__arrow" aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="service-grid-wrap">
          <Container width="wide">
            <div className="grid-12">
              <div className="service-grid">
              <SectionHeading
                className="service-grid-intro"
                kicker={t('home.essentialsKicker')}
                title={<>{t('home.essentialsTitleLead')}<br /><span>{t('home.essentialsTitleAccent')}</span></>}
                description={t('home.essentialsDescription')}
              />
                {HOME_CATEGORIES.map((category) => (
                  <Link className={`service-card ${category.homeClass}`} to={category.href} key={category.slug}>
                    <h2>{t(`categories.${category.slug}.title`)}</h2>
                    <p>{t(`categories.${category.slug}.description`)}</p>
                    {category.image ? <img className={`service-art ${category.homeClass}-art`} src={category.image} alt={t(`categories.${category.slug}.imageAlt`)} /> : null}
                    <div className={`tags-row ${category.tagsClass ?? ''}`.trim()}>
                      {tList(`categories.${category.slug}.tags`).map((tag) => (
                        <Badge size="sm" tone={category.hotTags ? 'accent' : 'neutral'} mediaOverlay={!category.hotTags} key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="instructors-block">
          <Container width="wide">
            <div className="grid-12 instructors-layout">
              <div className="instructors-heading">
                <SectionHeading kicker={t('home.instructorsKicker')} title={t('home.instructorsTitle')} />
              </div>

              <div className="instructors-grid">
                <article className="cta-card">
                  <p>{t('home.instructorsIntro')}</p>
                  <Link className="outline-btn ui-btn-md" to="/instructors">
                    {t('home.instructorsAction')}
                    <img className="ui-btn-md__arrow" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                  </Link>
                </article>

                {instructors.map((instructor) => (
                  <InstructorCard instructor={instructor} key={instructor.id} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="faq-block">
          <Container width="wide">
            <FaqAccordion className="faq-layout" />
          </Container>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
