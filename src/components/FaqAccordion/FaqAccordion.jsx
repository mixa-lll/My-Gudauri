import { useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { SectionHeading } from '../UI/SectionHeading/SectionHeading';
import './FaqAccordion.scss';

export function FaqAccordion({ items, className, initialOpen = 0, title = 'FAQ', kicker = 'Frequently Asked Questions' }) {
  const [openIndex, setOpenIndex] = useState(initialOpen);
  const baseId = useId();
  const safeItems = items ?? [];
  const titleId = `${baseId}-title`;

  return (
    <section className={cn('faq', className)} aria-labelledby={titleId}>
      <SectionHeading className="faq__head" kicker={kicker} size="md" title={title} titleId={titleId} />

      <div className="faq__list">
        {safeItems.map((item, index) => {
          const isOpen = openIndex === index;
          const triggerId = `${baseId}-trigger-${index}`;
          const answerId = `${baseId}-answer-${index}`;
          return (
            <article key={item.question} className={cn('faq__item', isOpen && 'is-open')}>
              <button
                id={triggerId}
                className="faq__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex((current) => current === index ? null : index)}
              >
                <span className="faq__icon" aria-hidden="true" />
                <span className="faq__question">{item.question}</span>
              </button>

              <div
                id={answerId}
                className="faq__answer-wrap"
                aria-hidden={!isOpen}
                aria-labelledby={triggerId}
                role="region"
              >
                <p className="faq__answer">
                  {item.answer}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
