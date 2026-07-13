import { useEffect } from 'react';
import { CalculatorBanner } from '../../components/CalculatorBanner/CalculatorBanner';
import { FaqAccordion } from '../../components/FaqAccordion/FaqAccordion';
import { InstructorCard } from '../../components/InstructorCard/InstructorCard';
import { SiteFooter } from '../../components/SiteFooter/SiteFooter';
import { SiteNavbar } from '../../components/SiteNavbar/SiteNavbar';
import { Container } from '../../components/UI/Container/Container';
import { FAQ_ITEMS } from '../../data/faqItems';
import { INSTRUCTORS } from '../../data/instructors';
import '../../../styles/system.css';
import '../../../styles/design-2-instructors.css';
import './InstructorsPage.scss';

const BENEFITS = [
  {
    icon: '/assets/design-2/icon-verified.png',
    title: 'Verified professionals',
    description: 'Every instructor is reviewed before joining the platform.'
  },
  {
    icon: '/assets/design-2/icon-price.png',
    title: 'Transparent pricing',
    description: 'The same official rate for everyone, with no hidden markups.'
  },
  {
    icon: '/assets/design-2/icon-profile.png',
    title: 'Real profiles',
    description: 'Compare experience, languages, reviews and teaching style.'
  },
  {
    icon: '/assets/design-2/icon-calendar.png',
    title: 'Flexible scheduling',
    description: 'Split lesson hours across days in a way that suits you.'
  }
];

const BOOKING_STEPS = [
  {
    title: 'Choose your instructor',
    description: 'Compare profiles, experience, reviews and languages, then select the teaching style that fits you best.',
    visual: 'squares'
  },
  {
    title: 'Submit lesson details',
    description: 'Enter preferred dates, lesson hours, group size, skill level and any special requests.',
    visual: 'form'
  },
  {
    title: 'Request received',
    description: 'You receive a booking reference immediately. Our team then checks availability for you.',
    visual: 'id'
  },
  {
    title: 'Schedule coordination',
    description: 'A booking manager contacts you to confirm instructor availability and finalize the schedule.',
    visual: 'operator'
  },
  {
    title: 'Secure payment and confirmation',
    description: 'Pay through a secure link. After payment, you receive final confirmation and the instructor contact details.',
    visual: 'payment'
  }
];

function StepVisual({ type }) {
  if (type === 'squares') {
    return <div className="step-squares" aria-hidden="true"><i /><i /><i className="active" /><i /><i /><i /></div>;
  }

  if (type === 'form') {
    return <div className="step-form-icon" aria-hidden="true"><b>Form</b><i /><i /><i /><i /><span /><span /></div>;
  }

  if (type === 'id') {
    return (
      <div className="step-id-icon" aria-hidden="true">
        <img src="/assets/design-2/step-idcard.svg" alt="" />
        <img className="step-id-dot" src="/assets/design-2/step-id-dot.svg" alt="" />
        <img className="step-id-check" src="/assets/design-2/icon-check.svg" alt="" />
      </div>
    );
  }

  if (type === 'operator') {
    return (
      <div aria-hidden="true">
        <img className="step-operator" src="/assets/design-2/step-operator.png" alt="" />
        <img className="step-operator-arrow" src="/assets/design-2/step-arrow.png" alt="" />
        <img className="step-operator-link" src="/assets/design-2/step-link.png" alt="" />
      </div>
    );
  }

  return <img className="step-payment" src="/assets/design-2/step-payment.png" alt="" aria-hidden="true" />;
}

function BookingStep({ step, index }) {
  return (
    <article className={`booking-step booking-step-${index + 1}`}>
      <div className="step-head">
        <span className={`step-index ${index === 0 ? 'is-active' : ''}`}>{index + 1}</span>
        <span>Step</span>
      </div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <StepVisual type={step.visual} />
    </article>
  );
}

export function InstructorsPage() {
  useEffect(() => {
    document.body.classList.add('catalog-page-body');
    return () => document.body.classList.remove('catalog-page-body');
  }, []);

  return (
    <div className="catalog-page">
      <SiteNavbar className="catalog-nav-host" />

      <main className="catalog-main">
        <section className="catalog-header" aria-labelledby="catalog-title">
          <Container className="catalog-header__container">
            <div className="catalog-title-wrap">
              <div className="catalog-sport-pills" aria-label="Available disciplines">
                {['Snowboard', 'Ski'].map((sport) => (
                  <span className="catalog-sport-pill ui-pill-md ui-pill-md--outline" key={sport}>
                    <img className="ui-pill-md__icon" src="/assets/ui-kit/pill-icon.png" alt="" aria-hidden="true" />
                    {sport}
                  </span>
                ))}
              </div>
              <h1 id="catalog-title" className="catalog-title">Instructors</h1>
            </div>
            <CalculatorBanner />
          </Container>
        </section>

        <section className="catalog-list" aria-labelledby="catalog-list-title">
          <Container>
            <div className="catalog-list__toolbar">
              <div>
                <p className="catalog-kicker">Filters</p>
                <div className="catalog-filters" aria-label="Instructor filters">
                  {['Discipline', 'Level', 'Language'].map((filter) => (
                    <button className="catalog-filter-btn ui-pill-md ui-pill-md--outline" type="button" key={filter}>
                      {filter}
                      <img src="/assets/design-2/icon-caret.png" alt="" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="catalog-list__meta">
                <h2 id="catalog-list-title">Available instructors</h2>
                <p className="catalog-count">{INSTRUCTORS.length} instructors</p>
              </div>
            </div>

            <div className="catalog-cards-grid">
              {INSTRUCTORS.map((instructor) => (
                <InstructorCard instructor={instructor} className="catalog-card" key={instructor.id} />
              ))}
            </div>
          </Container>
        </section>

        <section className="catalog-benefits" aria-labelledby="benefits-title">
          <Container>
            <div className="catalog-benefits-panel">
              <div className="section-heading">
                <p className="catalog-kicker section-heading__kicker">Trust us</p>
                <h2 id="benefits-title" className="catalog-section-title section-heading__title">Why choose My Gudauri instructors</h2>
              </div>

              <div className="benefits-grid">
                {BENEFITS.map((benefit) => (
                  <article className="benefit-card" key={benefit.title}>
                    <img src={benefit.icon} alt="" aria-hidden="true" />
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </article>
                ))}
              </div>

              <div className="section-heading booking-head">
                <p className="catalog-kicker booking-kicker section-heading__kicker">5 steps to book an instructor</p>
                <h2 className="catalog-section-title section-heading__title">How booking works</h2>
              </div>

              <div className="booking-steps-grid">
                {BOOKING_STEPS.map((step, index) => (
                  <BookingStep step={step} index={index} key={step.title} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="catalog-faq-block">
          <Container>
            <FaqAccordion items={FAQ_ITEMS} />
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
