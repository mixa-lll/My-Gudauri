import { useId } from 'react';
import { cn } from '../../utils/cn';
import { Accordion } from '../UI/Accordion/Accordion';
import { SectionHeading } from '../UI/SectionHeading/SectionHeading';
import './FaqAccordion.scss';

export function FaqAccordion({ id = 'questions', items, className, initialOpen = 0, title = 'FAQ', kicker = 'Frequently Asked Questions', variant = 'default' }) {
  if (!['default', 'object'].includes(variant)) throw new Error(`FaqAccordion: unsupported variant “${variant}”.`);
  const baseId = useId();
  const safeItems = items ?? [];
  const titleId = `${baseId}-title`;

  return (
    <section id={id} className={cn('faq', `faq--${variant}`, className)} aria-labelledby={titleId}>
      <SectionHeading className="faq__head" kicker={kicker} size={variant === 'object' ? 'sm' : 'md'} title={title} titleId={titleId} />

      <Accordion className="faq__list" items={safeItems} initialOpen={initialOpen} ariaLabel={title} />
    </section>
  );
}
