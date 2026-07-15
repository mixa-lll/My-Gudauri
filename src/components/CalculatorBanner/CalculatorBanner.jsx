import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../UI/Button/Button';
import './CalculatorBanner.scss';

const HOUR_OPTIONS = [2, 4, 6];
const RATE_PER_2H = 345;
const GEL_PER_USD = 2.75;

export function CalculatorBanner() {
  const [open, setOpen] = useState(false);
  const [hoursIndex, setHoursIndex] = useState(0);
  const [people, setPeople] = useState(1);
  const [currency, setCurrency] = useState('gel');
  const triggerRef = useRef(null);
  const closeRef = useRef(null);

  const hours = HOUR_OPTIONS[hoursIndex];

  const price = useMemo(() => {
    const totalGel = Math.round((hours / 2) * RATE_PER_2H * people);
    if (currency === 'usd') {
      const totalUsd = Math.round(totalGel / GEL_PER_USD);
      return `${totalUsd} USD`;
    }
    return `${totalGel} GEL`;
  }, [currency, hours, people]);

  useEffect(() => {
    if (!open) return undefined;

    const onEscape = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('keydown', onEscape);
    document.body.classList.add('is-scroll-locked');
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.classList.remove('is-scroll-locked');
    };
  }, [open]);

  const decreaseHours = () => setHoursIndex((prev) => Math.max(prev - 1, 0));
  const increaseHours = () => setHoursIndex((prev) => Math.min(prev + 1, HOUR_OPTIONS.length - 1));
  const decreasePeople = () => setPeople((prev) => Math.max(prev - 1, 1));
  const increasePeople = () => setPeople((prev) => Math.min(prev + 1, 10));
  const closeModal = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <article className="calc-banner">
        <img className="calc-banner__info" src="/assets/design-2/icon-info.png" alt="" aria-hidden="true" />

        <div className="calc-banner__row">
          <p>Single rate for all instructors</p>
          <span>345 gel/h</span>
        </div>

        <small>The more you take, the cheaper it gets !</small>

        <Button
          ref={triggerRef}
          variant="outline"
          size="md"
          className="calc-banner__trigger"
          iconLeft="/assets/design-2/calc/btn-calc-left.png"
          iconRight="/assets/design-2/calc/btn-calc-right.png"
          onClick={() => setOpen(true)}
        >
          Calculate the cost
        </Button>
      </article>

      {open ? createPortal(
        <div className="calc-modal is-open">
        <button className="calc-modal__backdrop" type="button" aria-label="Close calculator" onClick={closeModal} />

        <section className="calc-modal__panel" role="dialog" aria-modal="true" aria-labelledby="cost-calculator-title">
          <header className="calc-modal__head">
            <h3 id="cost-calculator-title">Cost calculator</h3>
            <button ref={closeRef} className="calc-modal__close" type="button" aria-label="Close calculator" onClick={closeModal}>
              <img src="/assets/design-2/calc/icon-calc-close.png" alt="" aria-hidden="true" />
            </button>
          </header>

          <div className="calc-modal__grid">
            <div className="calc-modal__metric">
              <p>Total number of hours</p>
              <div className="calc-modal__value">
                <b>{hours}</b>
                <span>hour</span>
              </div>
              <div className="calc-modal__stepper">
                <button type="button" aria-label="Decrease lesson hours" onClick={decreaseHours}>
                  <img src="/assets/design-2/calc/stepper-minus.svg" alt="" aria-hidden="true" />
                </button>
                <button type="button" aria-label="Increase lesson hours" onClick={increaseHours}>
                  <img src="/assets/design-2/calc/stepper-plus.svg" alt="" aria-hidden="true" />
                </button>
              </div>
            </div>

            <span className="calc-modal__symbol calc-modal__symbol--star">*</span>

            <div className="calc-modal__metric">
              <p>Number of people</p>
              <div className="calc-modal__value">
                <b>{people}</b>
                <span>people</span>
              </div>
              <div className="calc-modal__stepper">
                <button type="button" aria-label="Decrease number of people" onClick={decreasePeople}>
                  <img src="/assets/design-2/calc/stepper-minus.svg" alt="" aria-hidden="true" />
                </button>
                <button type="button" aria-label="Increase number of people" onClick={increasePeople}>
                  <img src="/assets/design-2/calc/stepper-plus.svg" alt="" aria-hidden="true" />
                </button>
              </div>
            </div>

            <span className="calc-modal__symbol">=</span>

            <div className="calc-modal__result">
              <div className="calc-modal__result-head">
                <p>Final price</p>
                <small>
                  Save <span>12%</span>
                </small>
              </div>

              <strong>{price}</strong>

              <div className="calc-modal__currency">
                <button
                  className={currency === 'gel' ? 'is-active' : ''}
                  type="button"
                  aria-pressed={currency === 'gel'}
                  onClick={() => setCurrency('gel')}
                >
                  GEL
                </button>
                <button
                  className={currency === 'usd' ? 'is-active' : ''}
                  type="button"
                  aria-pressed={currency === 'usd'}
                  onClick={() => setCurrency('usd')}
                >
                  USD
                </button>
              </div>
            </div>
          </div>

          <p className="calc-modal__note">
            <img src="/assets/design-2/calc/info-banner.png" alt="" aria-hidden="true" />
            Hours can be split across multiple days. Available in <span>2</span>, <span>4</span> or <span>6-hour</span>{' '}
            daily sessions.
          </p>
        </section>
      </div>,
        document.body
      ) : null}
    </>
  );
}
