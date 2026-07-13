import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { SectionHeading } from '../../components/UI/SectionHeading/SectionHeading';
import { InstructorCard } from '../../components/InstructorCard/InstructorCard';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { FAQ_ITEMS } from '../../data/faqItems';
import { INSTRUCTORS } from '../../data/instructors';
import '../../../styles/system.css';
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
                <article className="service-card instructors">
                  <h2>Instructors</h2>
                  <p>Verified ski and snowboard coaches</p>
                  <img className="service-art instructors-art" src="/assets/design-1/mosaic/instructors-1-98.png" alt="Instructor" />
                  <div className="tags-row">
                    <span className="tag">Ski</span>
                    <span className="tag">Snowboard</span>
                  </div>
                </article>

                <article className="service-card tours">
                  <h2>Tours</h2>
                  <p>Routes, freeride and mountain adventures</p>
                  <img className="service-art tours-art" src="/assets/design-1/mosaic/tours-1-117-upd.png" alt="Tour activity" />
                  <div className="tags-row tours-tags">
                    <span className="tag hot">Freeride</span>
                    <span className="tag hot">Ski tour</span>
                  </div>
                </article>

                <article className="service-card rental">
                  <h2>Rental</h2>
                  <p>Equipment for every level and style</p>
                  <img className="service-art rental-art" src="/assets/design-1/mosaic/rental-1-135-upd.png" alt="Ski equipment" />
                  <div className="tags-row rental-tags">
                    <span className="tag">Ski</span>
                    <span className="tag">Snowboard</span>
                  </div>
                </article>

                <article className="service-card places">
                  <h2>Places</h2>
                  <p>Restaurants, bars and places worth visiting</p>
                  <img className="service-art places-art" src="/assets/design-1/mosaic/places-1-154.png" alt="Mountain cafe" />
                  <div className="tags-row">
                    <span className="tag">Bars</span>
                    <span className="tag">Restaurants</span>
                  </div>
                </article>

                <article className="service-card services tall">
                  <h2>Services</h2>
                  <p>Local professionals for your trip</p>
                  <img className="service-art services-art" src="/assets/design-1/mosaic/services-1-107.png" alt="Photographer" />
                  <div className="tags-row services-tags">
                    <span className="tag">Nannies</span>
                    <span className="tag">Foto</span>
                    <span className="tag">Video</span>
                  </div>
                </article>

                <article className="service-card transfer">
                  <h2>Transfer</h2>
                  <p>Comfortable rides to and from the resort</p>
                  <img className="service-art transfer-art" src="/assets/design-1/mosaic/transfer-1-144-upd.png" alt="Transfer van" />
                  <div className="tags-row transfer-tags">
                    <span className="tag">Batumi - Gudauri</span>
                    <span className="tag">Tbilisi - Gudauri</span>
                  </div>
                </article>

                <article className="service-card real-estate">
                  <h2>Real estate</h2>
                  <p>Apartments and stays close to the slopes</p>
                  <div className="tags-row real-estate-tags">
                    <span className="tag">Apartments</span>
                  </div>
                </article>
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

        <footer className="home-footer">
          <div className="container">
            <div className="grid-12 footer-layout">
              <div className="footer-top">
                <div className="footer-brand-wrap">
                  <div className="brand">My Gudauri <img src="/assets/design-1/ellipse-8.svg" alt="" aria-hidden="true" /></div>
                  <p>Independent platform connecting guests with verified local instructors and activities in Gudauri.</p>
                </div>
              </div>

              <div className="footer-main">
                <div className="contacts">
                  <div><span>Phone number</span><p>+995 123 45 65</p></div>
                  <div><span>Email</span><p>Mygudauri@gmail.com</p></div>
                  <div><span>Address</span><p>Gudauri, Georgia</p></div>
                </div>
                <div className="footer-nav">
                  <a href="#articles">Articles</a>
                  <a href="#about">About Gudauri</a>
                  <a href="#support">Support</a>
                </div>
                <div className="footer-sections">
                  <span>Sections</span>
                  <div>
                    <Link to="/instructors">Instructors</Link><Link to="/summary">Services</Link>
                    <Link to="/summary">Places</Link><Link to="/summary">Activity</Link>
                    <Link to="/summary">Transfer</Link><Link to="/summary">Rent</Link>
                  </div>
                </div>
              </div>

              <img className="footer-line" src="/assets/design-1/line-26.svg" alt="" aria-hidden="true" />
              <div className="footer-bottom">
                <div className="legal"><span>© 2026 My Gudauri</span><span>Cookies Policy</span><span>Privacy Policy</span></div>
                <div className="socials">
                  <img src="/assets/design-1/telegram-4-1.png" alt="Telegram" />
                  <img src="/assets/design-1/instagram-3-1.png" alt="Instagram" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
