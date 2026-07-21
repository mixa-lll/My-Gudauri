import { useId } from 'react';
import { cn } from '../../utils/cn';
import { Accordion } from '../UI/Accordion/Accordion';
import { SectionHeading } from '../UI/SectionHeading/SectionHeading';
import './FaqAccordion.scss';

export function FaqAccordion({ id = 'questions', items, className, initialOpen = 0, title = 'FAQ', kicker = 'Frequently Asked Questions' }) {
  const baseId = useId();
  const safeItems = items ?? [];
  const titleId = `${baseId}-title`;

  return (
    <section id={id} className={cn('faq', className)} aria-labelledby={titleId}>
      <SectionHeading className="faq__head" kicker={kicker} size="md" title={title} titleId={titleId} />

      <Accordion className="faq__list" items={safeItems} initialOpen={initialOpen} ariaLabel={title} />
    </section>
  );
}
