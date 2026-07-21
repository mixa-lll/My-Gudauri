import { useId, useState } from 'react';
import { cn } from '../../../utils/cn';
import './Accordion.scss';

export function AccordionItem({ question, answer, open, onToggle, id }) {
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  return <article className={cn('ui-accordion__item', open && 'is-open')}>
    <h3>
      <button id={triggerId} type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span>{question}</span><span className="ui-accordion__icon" aria-hidden="true" />
      </button>
    </h3>
    <div id={panelId} className="ui-accordion__panel" aria-labelledby={triggerId} role="region" hidden={!open}><div>{answer}</div></div>
  </article>;
}

export function Accordion({ items = [], initialOpen = 0, allowCollapse = true, className, ariaLabel = 'Accordion' }) {
  const [openIndex, setOpenIndex] = useState(initialOpen);
  const baseId = useId();
  return <div className={cn('ui-accordion', className)} aria-label={ariaLabel}>{items.map((item, index) => <AccordionItem key={item.id ?? item.question} id={`${baseId}-${index}`} question={item.question} answer={item.answer} open={openIndex === index} onToggle={() => setOpenIndex((current) => current === index && allowCollapse ? null : index)} />)}</div>;
}
