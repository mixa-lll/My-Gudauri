import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Container, FadeUp, FaqAccordion, HoverArrow, InstructorCard, SectionHeading, SiteFooter, SiteNavbar, useCoverParallax, WordsPullUp } from '../../design-system';
import { HomeHeroSearchPanel } from '../../components/product';
import { HOME_CATEGORIES } from '../../data/siteCategories';
import { useLanguage } from '../../i18n/LanguageContext';
import { getActivities } from '../../services/activitiesApi';
import { getInstructors } from '../../services/instructorsApi';
import './HomePage.scss';

export function HomePage() {
  const { t, tList } = useLanguage();
  const [instructors, setInstructors] = useState([]);
  const [activities, setActivities] = useState([]);
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

  useEffect(() => {
    let active = true;
    getActivities().then((items) => {
      if (active) setActivities(items);
    }).catch(() => {
      if (active) setActivities([]);
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
              <span className="home-cover__lift" aria-hidden="true">
                <i className="home-cover__lift-cable home-cover__lift-cable--upper" />
                <i className="home-cover__lift-cable" />
                <img className="home-cover__lift-cabin" src="/assets/design-1/lift-cabin.webp" alt="" />
              </span>
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
                layout="split"
                divider
                tone="accent"
                kicker={t('home.essentialsKicker')}
                title={<>{t('home.essentialsTitleLead')}<br /><span>{t('home.essentialsTitleAccent')}</span></>}
                description={t('home.essentialsDescription')}
              />
                {HOME_CATEGORIES.map((category) => (
                  <Link className={`service-card hover-card ${category.homeClass}`} to={category.href} key={category.slug}>
                    <div className="service-card__head">
                      <div className="service-card__text">
                        <h2>{t(`categories.${category.slug}.title`)}</h2>
                        <p>{t(`categories.${category.slug}.description`)}</p>
                      </div>
                      <HoverArrow variant="pill" />
                    </div>
                    {category.image ? <img className={`service-art ${category.homeClass}-art`} src={category.image} alt={t(`categories.${category.slug}.imageAlt`)} /> : null}
                    {/* Tags sit on the white plate, not over the artwork, so they
                        carry their own fill: the first one warm, the rest grey. */}
                    <div className={`tags-row ${category.tagsClass ?? ''}`.trim()}>
                      {tList(`categories.${category.slug}.tags`).map((tag) => (
                        <Badge size="sm" tone="neutral" key={tag}>{tag}</Badge>
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
            <div className="instructors-layout">
              <SectionHeading
                layout="split"
                divider
                tone="accent"
                kicker={t('home.instructorsKicker')}
                title={t('home.instructorsTitle')}
                description={t('home.instructorsIntro')}
                actions={(
                  <Link className="pill-btn" to="/instructors">
                    {t('home.instructorsAction')}
                    <HoverArrow />
                  </Link>
                )}
              />

              <div className="instructors-grid">
                {instructors.slice(0, 3).map((instructor) => (
                  <InstructorCard instructor={instructor} key={instructor.id} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Activities read as a list, not cards: the rows compare on the same
            four columns, which is how someone picks between a road trip and a
            heli drop. */}
        <section className="activities-block">
          <Container width="wide">
            <div className="activities-layout">
              <SectionHeading
                layout="split"
                divider
                tone="accent"
                kicker={t('home.activitiesKicker')}
                title={t('home.activitiesTitle')}
                description={t('home.activitiesDescription')}
              />

              <div className="activity-rows">
                {activities.slice(0, 6).map((activity) => (
                  <Link className="activity-row hover-card" to={`/activities/${activity.slug}`} key={activity.slug}>
                    <span className="activity-row__category">{activity.category}</span>
                    <h3 className="activity-row__title">{activity.name}</h3>
                    <span className="activity-row__facts">
                      {(activity.facts ?? []).slice(0, 3).map((fact) => (Array.isArray(fact) ? fact[1] : fact.value)).filter(Boolean).join(' · ')}
                    </span>
                    <span className="activity-row__price">
                      <strong>{activity.price}</strong>
                      {activity.priceSuffix ? <small>{activity.priceSuffix}</small> : null}
                    </span>
                    <HoverArrow variant="pill" className="activity-row__arrow" />
                  </Link>
                ))}
              </div>

              <div className="activities-foot">
                <div className="activities-tags">
                  {tList('home.activitiesTags').map((tag, index) => (
                    <Badge size="md" tone={index === tList('home.activitiesTags').length - 1 ? 'accent' : 'neutral'} key={tag}>{tag}</Badge>
                  ))}
                </div>
                <Link className="pill-btn" to="/activities">
                  {t('home.activitiesAction')}
                  <HoverArrow />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="about-block">
          <Container width="wide">
            <div className="about-layout">
              <div className="about-lead">
                <SectionHeading
                  divider
                  tone="accent"
                  kicker={t('home.aboutKicker')}
                  title={<>{t('home.aboutTitleLead')}<br /><span>{t('home.aboutTitleAccent')}</span></>}
                />
                <p className="about-text">{t('home.aboutText')}</p>

                <div className="about-stats">
                  <div className="about-stat">
                    <strong>2 196 m</strong>
                    <span>{t('home.aboutStatAltitude')}</span>
                  </div>
                  <div className="about-stat">
                    <strong>3 276 m</strong>
                    <span>{t('home.aboutStatLift')}</span>
                  </div>
                  <div className="about-stat about-stat--accent">
                    <strong>~120 km</strong>
                    <span>{t('home.aboutStatDistance')}</span>
                  </div>
                </div>

                <Link className="pill-btn" to="/about-gudauri">
                  {t('home.aboutAction')}
                  <HoverArrow />
                </Link>
              </div>

              <figure className="about-map">
                <Link className="about-map__frame hover-card" to="/about-gudauri">
                  <img src="/assets/about-gudauri/map-gudauri-ski-resort.jpg" alt={t('home.aboutMapAlt')} />
                  <span className="about-map__badge">{t('home.aboutMapBadge')}</span>
                  <span className="about-map__action">
                    {t('home.aboutMapAction')}
                    <HoverArrow />
                  </span>
                </Link>
                <figcaption>{t('home.aboutMapCaption')}</figcaption>
              </figure>
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
