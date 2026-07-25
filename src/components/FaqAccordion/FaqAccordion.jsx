import { useId } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { cn } from '../../utils/cn';
import { Accordion } from '../UI/Accordion/Accordion';
import { SectionHeading } from '../UI/SectionHeading/SectionHeading';
import './FaqAccordion.scss';

export function FaqAccordion({ id = 'questions', items, className, initialOpen = 0, title, kicker, variant = 'default' }) {
  if (!['default', 'object'].includes(variant)) throw new Error(`FaqAccordion: unsupported variant “${variant}”.`);
  const { t, tList } = useLanguage();
  const baseId = useId();
  const isObject = variant === 'object';
  const safeItems = items ?? tList('faq.items');
  const resolvedTitle = title ?? t(isObject ? 'faq.objectTitle' : 'faq.title');
  const resolvedKicker = kicker ?? t(isObject ? 'faq.objectKicker' : 'faq.kicker');
  const titleId = `${baseId}-title`;

  return (
    <section id={id} className={cn('faq', `faq--${variant}`, className)} aria-labelledby={titleId}>
      <SectionHeading className="faq__head" kicker={resolvedKicker} size={isObject ? 'sm' : 'md'} title={resolvedTitle} titleId={titleId} />

      <Accordion className="faq__list" items={safeItems} initialOpen={initialOpen} ariaLabel={resolvedTitle} />
    </section>
  );
}
