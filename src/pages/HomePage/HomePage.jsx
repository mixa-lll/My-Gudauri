import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Container, FaqAccordion, InstructorCard, SectionHeading, SiteFooter, SiteNavbar } from '../../design-system';
import { HomeHeroSearch } from '../../components/product';
import { FAQ_ITEMS } from '../../data/faqItems';
import { INSTRUCTORS } from '../../data/instructors';
import { HOME_CATEGORIES } from '../../data/siteCategories';
import './HomePage.scss';

export function HomePage() {
  useEffect(() => {
    document.body.classList.add('home-page-body');
    return () => {
      document.body.classList.remove('home-page-body');
    };
  }, []);

  return (
    <>
      <div className="home-page">
        <SiteNavbar className="site-nav-host--hero" />
        <section className="hero-wrap">
          <Container width="wide">
            <div className="grid-12 hero-grid">
              <div className="hero-inner">
                <div className="hero-media" aria-hidden="true">
                  <img src="/assets/design-1/hero-gudauri-panorama.jpg" alt="" />
                </div>

                <div className="hero-content">
                  <div className="hero-meta-pills" aria-label="Gudauri guide context">
                    <Badge size="sm" mediaOverlay>Local guide</Badge>
                    <Badge size="sm" mediaOverlay>Winter 2026</Badge>
                  </div>
                  <h1 className="hero-title-main">MY GUDAURI</h1>
                  <p className="hero-subtitle">Trusted local services for an effortless mountain stay.</p>
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
                    <strong>About Gudauri</strong>
                    <small>Resort map &amp; guide</small>
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
                kicker="Gudauri essentials"
                title={<>Everything you need,<br /><span>in one place.</span></>}
                description="Plan less. Ski more. Choose verified people and services with clear details and local support."
              />
                {HOME_CATEGORIES.map((category) => (
                  <Link className={`service-card ${category.homeClass}`} to={category.href} key={category.slug}>
                    <h2>{category.title}</h2>
                    <p>{category.description}</p>
                    {category.image ? <img className={`service-art ${category.homeClass}-art`} src={category.image} alt={category.imageAlt} /> : null}
                    <div className={`tags-row ${category.tagsClass ?? ''}`.trim()}>
                      {category.tags.map((tag) => (
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
                <SectionHeading kicker="Verified professionals" title="Find your instructor" />
              </div>

              <div className="instructors-grid">
                <article className="cta-card">
                  <p>
                    Compare experience, languages and real guest reviews to find the right teaching style for you.
                  </p>
                  <Link className="outline-btn ui-btn-md" to="/instructors">
                    Show all instructors
                    <img className="ui-btn-md__arrow" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                  </Link>
                </article>

                {INSTRUCTORS.slice(0, 3).map((instructor) => (
                  <InstructorCard instructor={instructor} key={instructor.id} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="faq-block">
          <Container width="wide">
            <FaqAccordion className="faq-layout" items={FAQ_ITEMS} />
          </Container>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
