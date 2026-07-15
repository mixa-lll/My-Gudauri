import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { SectionHeading } from '../../components/UI/SectionHeading/SectionHeading';
import { InstructorCard } from '../../components/InstructorCard/InstructorCard';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { HomeHeroSearch } from '../../components/HomeHeroSearch/HomeHeroSearch';
import { FAQ_ITEMS } from '../../data/faqItems';
import { INSTRUCTORS } from '../../data/instructors';
import { HOME_CATEGORIES } from '../../data/siteCategories';
import '../../../styles/design-1-home.css';
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
        <section className="hero-wrap">
          <div className="container">
            <div className="grid-12 hero-grid">
              <SiteNavbar className="site-nav-host--hero" />

              <div className="hero-inner">
                <span className="date-pill">LOCAL GUIDE · 2026</span>
                <h1 className="hero-title-main">MY GUDAURI</h1>
                <p className="hero-subtitle">Trusted local services for an effortless mountain stay.</p>
                <HomeHeroSearch />

                <div className="hero-lift-wrap">
                  <img className="hero-lift" src="/assets/design-1/lift-on-corner-1-25.png" alt="Cable car" />
                </div>
                <div className="hero-mountains-wrap">
                  <img className="hero-mountains" src="/assets/design-1/cloud-head-2118-1400.png" alt="Gudauri mountain panorama" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="service-grid-wrap">
          <div className="container">
            <div className="grid-12">
              <div className="service-grid">
                <div className="service-grid-intro">
                  <p>Explore Gudauri</p>
                  <h2>Everything you need,<br /><span>in one place.</span></h2>
                  <div>Plan less. Ski more. Choose verified people and services with clear details and local support.</div>
                </div>
                {HOME_CATEGORIES.map((category) => (
                  <Link className={`service-card ${category.homeClass}`} to={category.href} key={category.slug}>
                    <h2>{category.title}</h2>
                    <p>{category.description}</p>
                    {category.image ? <img className={`service-art ${category.homeClass}-art`} src={category.image} alt={category.imageAlt} /> : null}
                    <div className={`tags-row ${category.tagsClass ?? ''}`.trim()}>
                      {category.tags.map((tag) => <span className={`tag ${category.hotTags ? 'hot' : ''}`.trim()} key={tag}>{tag}</span>)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="instructors-block">
          <div className="container">
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
          </div>
        </section>

        <section className="faq-block">
          <div className="container">
            <FaqAccordion className="faq-layout" items={FAQ_ITEMS} />
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
