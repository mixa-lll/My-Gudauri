import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Container, FadeUp, FaqAccordion, InstructorCard, SectionHeading, SiteFooter, SiteNavbar, useCoverParallax, WordsPullUp } from '../../design-system';
import { HomeHeroSearchPanel } from '../../components/product';
import { HOME_CATEGORIES } from '../../data/siteCategories';
import { useLanguage } from '../../i18n/LanguageContext';
import { getInstructors } from '../../services/instructorsApi';
import './HomePage.scss';

export function HomePage() {
  const { t, tList } = useLanguage();
  const [instructors, setInstructors] = useState([]);
  const coverRef = useRef(null);

  useCoverParallax(coverRef);

  useEffect(() => {
    document.body.classList.add('home-page-body');
    return () => {
      document.body.classList.remove('home-page-body');
    };
  }, []);

  useEffect(() => {
    let active = true;
    getInstructors().then((items) => {
      if (active) setInstructors(items);
    }).catch(() => {
      if (active) setInstructors([]);
    });
    return () => { active = false; };
  }, []);

  const proofRating = instructors.length
    ? (instructors.reduce((sum, item) => sum + Number(item.rating || 0), 0) / instructors.length).toFixed(1)
    : null;

  return (
    <>
      <div className="home-page">
        <section className="home-cover" ref={coverRef}>
          <div className="home-cover__frame">
          <div className="home-cover__media" aria-hidden="true">
            <div className="home-cover__sky">
              <span className="home-cover__glow" />
              <span className="home-cover__cloud home-cover__cloud--high" />
              <span className="home-cover__cloud home-cover__cloud--far" />
              <span className="home-cover__cloud home-cover__cloud--mid" />
              <span className="home-cover__cloud home-cover__cloud--near" />
            </div>
            <img className="home-cover__mountain" src="/assets/design-1/hero-gudauri-cutout.webp" alt="" />
            <span className="home-cover__cloud home-cover__cloud--front" />
            <span className="home-cover__cloud home-cover__cloud--front-low" />
            <img className="home-cover__foreground" src="/assets/design-1/hero-gudauri-foreground.webp" alt="" />
            <span className="home-cover__noise" />
          </div>

          <div className="home-cover__nav">
            <SiteNavbar className="site-nav-host--hero site-nav-host--overlay" />
          </div>

          <div className="home-cover__center">
            <h1 className="home-cover__title">
              <WordsPullUp lines={[t('home.hero.titleLine1'), t('home.hero.titleLine2')]} />
            </h1>
            <FadeUp delay={0.5}>
              <p className="home-cover__subtitle">{t('home.hero.subtitle')}</p>
            </FadeUp>
            <FadeUp className="home-cover__search" delay={0.7}>
              <HomeHeroSearchPanel />
            </FadeUp>
            <FadeUp delay={0.85}>
              <span className="home-cover__note">{t('home.hero.note')}</span>
            </FadeUp>
          </div>

          <div className="home-cover__bottom">
            <div className="home-cover__conditions" role="group" aria-label={t('home.hero.conditionsLabel')}>
              <span className="home-cover__conditions-main">
                <img src="/assets/design-2/icon-snow.png" alt="" aria-hidden="true" />
                <strong>{t('home.hero.conditionTemp')}</strong>
                <span>{t('home.hero.conditionSummary')}</span>
              </span>
              <span className="home-cover__conditions-divider" aria-hidden="true" />
              <span className="home-cover__conditions-item home-cover__conditions-item--full">{t('home.hero.conditionSnow')}</span>
              <span className="home-cover__conditions-item home-cover__conditions-item--short">{t('home.hero.conditionSnowShort')}</span>
              <span className="home-cover__conditions-divider" aria-hidden="true" />
              <span className="home-cover__conditions-item home-cover__conditions-lifts">
                <i aria-hidden="true" />
                {t('home.hero.conditionLifts')}
              </span>
            </div>

            {instructors.length ? (
              <Link className="home-cover__proof" to="/instructors">
                <span className="home-cover__proof-avatars" aria-hidden="true">
                  {instructors.slice(0, 3).map((instructor) => (
                    <img src={instructor.image} alt="" key={instructor.id} />
                  ))}
                </span>
                {t('home.hero.proof', { count: instructors.length, rating: proofRating })}
              </Link>
            ) : null}
          </div>
          </div>
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

                {instructors.slice(0, 3).map((instructor) => (
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
