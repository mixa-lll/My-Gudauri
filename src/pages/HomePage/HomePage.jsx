import { useEffect } from 'react';
import { SectionHeading } from '../../components/UI/SectionHeading/SectionHeading';
import '../../../styles/system.css';
import '../../../styles/design-1-home.css';
import '../../../styles/shared-faq.css';
import './HomePage.scss';

const LEGACY_SCRIPTS = [
  { id: 'home-shared-navbar', src: '/scripts/shared-navbar.js' },
  { id: 'home-shared-faq', src: '/scripts/shared-faq.js' },
  { id: 'home-design-1', src: '/scripts/design-1-home.js' }
];

function loadLegacyScript({ id, src }) {
  return new Promise((resolve, reject) => {
    const prev = document.querySelector(`script[data-legacy-script="${id}"]`);
    if (prev) prev.remove();

    const script = document.createElement('script');
    script.src = `${src}?v=${Date.now()}`;
    script.async = false;
    script.dataset.legacyScript = id;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.append(script);
  });
}

export function HomePage() {
  useEffect(() => {
    document.body.classList.add('home-page-body');

    let active = true;
    const initLegacyScripts = async () => {
      for (const descriptor of LEGACY_SCRIPTS) {
        if (!active) return;
        await loadLegacyScript(descriptor);
      }
    };

    initLegacyScripts().catch(() => {
      // Preserve page render even if one legacy script fails to load.
    });

    return () => {
      active = false;
      document.body.classList.remove('home-page-body');
      document.body.classList.remove('menu-open');
      document.querySelectorAll('script[data-legacy-script]').forEach((script) => script.remove());
    };
  }, []);

  return (
    <>
      <div className="home-nav-backdrop" data-nav-backdrop="" hidden />
      <div className="home-page">
        <section className="hero-wrap">
          <div className="container">
            <div className="grid-12 hero-grid">
              <header className="site-nav-host site-nav-host--hero" data-site-navbar="" />

              <div className="hero-inner">
                <span className="date-pill">06.03.2026</span>
                <h1 className="hero-title-main">MY GUDAURI</h1>
                <p className="hero-subtitle">All Gudauri services,one easy search</p>

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
                <article className="service-card instructors">
                  <h2>Instructors</h2>
                  <p>Здесь краткое описание на русском</p>
                  <img className="service-art instructors-art" src="/assets/design-1/mosaic/instructors-1-98.png" alt="Instructor" />
                  <div className="tags-row">
                    <span className="tag">ski</span>
                    <span className="tag">snowbord</span>
                  </div>
                </article>

                <article className="service-card tours">
                  <h2>Tours</h2>
                  <p>Здесь краткое описание на русском</p>
                  <img className="service-art tours-art" src="/assets/design-1/mosaic/tours-1-117-upd.png" alt="Tour activity" />
                  <div className="tags-row tours-tags">
                    <span className="tag hot">Freeride</span>
                    <span className="tag hot">Ski tour</span>
                  </div>
                </article>

                <article className="service-card rental">
                  <h2>Rental</h2>
                  <p>Здесь краткое описание на русском</p>
                  <img className="service-art rental-art" src="/assets/design-1/mosaic/rental-1-135-upd.png" alt="Ski equipment" />
                  <div className="tags-row rental-tags">
                    <span className="tag">ski</span>
                    <span className="tag">snowbord</span>
                  </div>
                </article>

                <article className="service-card places">
                  <h2>Places</h2>
                  <p>Здесь краткое описание на русском</p>
                  <img className="service-art places-art" src="/assets/design-1/mosaic/places-1-154.png" alt="Mountain cafe" />
                  <div className="tags-row">
                    <span className="tag">Bars</span>
                    <span className="tag">Restorans</span>
                  </div>
                </article>

                <article className="service-card services tall">
                  <h2>Services</h2>
                  <p>Здесь краткое описание на русском</p>
                  <img className="service-art services-art" src="/assets/design-1/mosaic/services-1-107.png" alt="Photographer" />
                  <div className="tags-row services-tags">
                    <span className="tag">Nannies</span>
                    <span className="tag">Foto</span>
                    <span className="tag">Video</span>
                  </div>
                </article>

                <article className="service-card transfer">
                  <h2>Transfer</h2>
                  <p>Здесь краткое описание на русском</p>
                  <img className="service-art transfer-art" src="/assets/design-1/mosaic/transfer-1-144-upd.png" alt="Transfer van" />
                  <div className="tags-row transfer-tags">
                    <span className="tag">Batumi - Gudauri</span>
                    <span className="tag">Tbilisi - Gudauri</span>
                  </div>
                </article>

                <article className="service-card real-estate">
                  <h2>Real estate</h2>
                  <p>Здесь краткое описание на русском</p>
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
                <SectionHeading kicker="Trust us" title="Find an instructor for yourself" />
              </div>

              <div className="instructors-grid">
                <article className="cta-card">
                  <p>
                    Study <strong>the tool</strong>, ask for
                    <strong>reviews</strong> and choose the
                    best one <strong>for yourself</strong>!
                  </p>
                  <button className="outline-btn ui-btn-md" type="button">
                    Show all instructors
                    <img className="ui-btn-md__arrow" src="/assets/ui-kit/btn-md-arrow-dark.png" alt="" aria-hidden="true" />
                  </button>
                </article>

                <article className="instructor-card card-hoverable">
                  <div className="instructor-media instructor-media--1">
                    <img className="photo-overlay" src="/assets/design-1/instructor-foreground.png" alt="Mikhail Andeev" />
                    <div className="chips-top">
                      <span className="chip ui-pill-md ui-pill-md--outline">Ge</span>
                      <span className="chip ui-pill-md ui-pill-md--outline">En</span>
                    </div>
                    <div className="chips-bottom">
                      <span className="chip ui-pill-md ui-pill-md--outline icon-chip"><img src="/assets/design-1/icon-snowboard-pill.png" alt="" aria-hidden="true" />Snowboard</span>
                      <span className="chip ui-pill-md ui-pill-md--outline icon-chip"><img src="/assets/design-1/icon-ski-pill.png" alt="" aria-hidden="true" />Ski</span>
                    </div>
                  </div>
                  <div className="instructor-body">
                    <h3>Mikhail Andeev</h3>
                    <p>Здесь краткое описание на русском</p>
                    <div className="rating-line">
                      <img src="/assets/design-1/stars-rating.svg" alt="4.8 stars" />
                      <span>4,8</span>
                      <img className="dot" src="/assets/design-1/dot-separator.svg" alt="" aria-hidden="true" />
                      <a href="#">6 reviews</a>
                    </div>
                  </div>
                </article>

                <article className="instructor-card card-hoverable">
                  <div className="instructor-media instructor-media--2">
                    <img className="photo-overlay cover" src="/assets/design-1/instructor-card-2.jpg" alt="Oleg Yung" />
                    <div className="chips-top">
                      <span className="chip ui-pill-md ui-pill-md--outline">Ge</span>
                      <span className="chip ui-pill-md ui-pill-md--outline">En</span>
                    </div>
                    <div className="chips-bottom">
                      <span className="chip ui-pill-md ui-pill-md--outline icon-chip"><img src="/assets/design-1/icon-snowboard-pill.png" alt="" aria-hidden="true" />Snowboard</span>
                    </div>
                  </div>
                  <div className="instructor-body">
                    <h3>Oleg Yung</h3>
                    <p>Здесь краткое описание на русском</p>
                    <div className="rating-line">
                      <img src="/assets/design-1/stars-rating.svg" alt="4.8 stars" />
                      <span>4,8</span>
                      <img className="dot" src="/assets/design-1/dot-separator.svg" alt="" aria-hidden="true" />
                      <a href="#">6 reviews</a>
                    </div>
                  </div>
                </article>

                <article className="instructor-card card-hoverable">
                  <div className="instructor-media instructor-media--3">
                    <img className="photo-overlay cover" src="/assets/design-1/instructor-card-3.png" alt="Mikhail Andeev skiing" />
                    <div className="chips-top">
                      <span className="chip ui-pill-md ui-pill-md--outline">Ge</span>
                      <span className="chip ui-pill-md ui-pill-md--outline">En</span>
                    </div>
                    <div className="chips-bottom">
                      <span className="chip ui-pill-md ui-pill-md--outline icon-chip"><img src="/assets/design-1/icon-snowboard-pill.png" alt="" aria-hidden="true" />Snowboard</span>
                    </div>
                  </div>
                  <div className="instructor-body">
                    <h3>Mikhail Andeev</h3>
                    <p>Здесь краткое описание на русском</p>
                    <div className="rating-line">
                      <img src="/assets/design-1/stars-rating.svg" alt="4.8 stars" />
                      <span>4,8</span>
                      <img className="dot" src="/assets/design-1/dot-separator.svg" alt="" aria-hidden="true" />
                      <a href="#">6 reviews</a>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-block">
          <div className="container">
            <div className="grid-12 faq-layout faq-component" data-faq-component="" />
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
                  <div><span>Adress</span><p>Gudauri, Georgia</p></div>
                </div>
                <div className="footer-nav">
                  <a href="#">Articles</a>
                  <a href="#">About Gudauri</a>
                  <a href="#">Support</a>
                </div>
                <div className="footer-sections">
                  <span>Sections</span>
                  <div>
                    <a href="#">Instructors</a><a href="#">Services</a>
                    <a href="#">Places</a><a href="#">Activity</a>
                    <a href="#">Transfer</a><a href="#">Rent</a>
                  </div>
                </div>
              </div>

              <img className="footer-line" src="/assets/design-1/line-26.svg" alt="" aria-hidden="true" />
              <div className="footer-bottom">
                <div className="legal"><span>© 2026 MuGudauri, Inc.</span><span>Cookies Policy</span><span>Privacy Policy</span></div>
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
