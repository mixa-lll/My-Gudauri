import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import './FaqAccordion.scss';

export function FaqAccordion({ items, className, initialOpen = 0, title = 'FAQ', kicker = 'Frequently Asked Questions' }) {
  const [openIndex, setOpenIndex] = useState(initialOpen);
  const contentRefs = useRef([]);
  const [heights, setHeights] = useState([]);

  const safeItems = useMemo(() => items ?? [], [items]);

  useEffect(() => {
    const nextHeights = safeItems.map((_, index) => {
      const node = contentRefs.current[index];
      return node ? node.scrollHeight : 0;
    });
    setHeights(nextHeights);
  }, [safeItems]);

  useEffect(() => {
    const onResize = () => {
      const nextHeights = safeItems.map((_, index) => {
        const node = contentRefs.current[index];
        return node ? node.scrollHeight : 0;
      });
      setHeights(nextHeights);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [safeItems]);

  return (
    <section className={cn('faq', className)}>
      <header className="faq__head">
        <p>{kicker}</p>
        <h2>{title}</h2>
      </header>

      <div className="faq__list">
        {safeItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={item.question} className={cn('faq__item', isOpen && 'is-open')}>
              <button
                className="faq__trigger"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(index)}
              >
                <span className="faq__icon" aria-hidden="true" />
                <span className="faq__question">{item.question}</span>
              </button>

              <div
                className="faq__answer-wrap"
                style={{ maxHeight: isOpen ? `${heights[index] ?? 0}px` : '0px' }}
                aria-hidden={!isOpen}
              >
                <p ref={(node) => (contentRefs.current[index] = node)} className="faq__answer">
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
