import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import legacyPageHtml from '../../../pages/design-2-instructors.html?raw';
import { InstructorCard } from '../../components/InstructorCard/InstructorCard';
import { INSTRUCTORS } from '../../data/instructors';
import '../../../styles/system.css';
import '../../../styles/shared-faq.css';
import '../../../styles/design-2-instructors.css';
import './InstructorsPage.scss';

const LEGACY_SCRIPTS = [
  { id: 'catalog-shared-navbar', src: '/scripts/shared-navbar.js' },
  { id: 'catalog-shared-faq', src: '/scripts/shared-faq.js' },
  { id: 'catalog-design-2', src: '/scripts/design-2-instructors.js' }
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

function extractBodyHtml(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const source = bodyMatch ? bodyMatch[1] : html;

  const normalizedSource = source
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replaceAll('./design-3-profile.html', '/profile')
    .replaceAll('./design-2-instructors.html', '/instructors');

  const template = document.createElement('template');
  template.innerHTML = normalizedSource;

  const cardsGrid = template.content.querySelector('.catalog-cards-grid');
  if (cardsGrid) {
    cardsGrid.replaceChildren();
    cardsGrid.setAttribute('data-instructor-grid', '');
  }

  const count = template.content.querySelector('.catalog-count');
  if (count) count.textContent = `${INSTRUCTORS.length} instructors`;

  return template.innerHTML;
}

export function InstructorsPage() {
  const content = useMemo(() => extractBodyHtml(legacyPageHtml), []);
  const [cardsHost, setCardsHost] = useState(null);

  useLayoutEffect(() => {
    setCardsHost(document.querySelector('.legacy-catalog-root [data-instructor-grid]'));
  }, [content]);

  useEffect(() => {
    document.body.classList.add('catalog-page-body');

    let active = true;
    const initLegacyScripts = async () => {
      for (const descriptor of LEGACY_SCRIPTS) {
        if (!active) return;
        await loadLegacyScript(descriptor);
      }
    };

    initLegacyScripts().catch(() => {
      // Keep content visible even if one script fails.
    });

    return () => {
      active = false;
      document.body.classList.remove('catalog-page-body');
      document.body.classList.remove('calc-modal-open');
      document.querySelectorAll('script[data-legacy-script]').forEach((script) => script.remove());
    };
  }, []);

  return (
    <>
      <div className="legacy-catalog-root" dangerouslySetInnerHTML={{ __html: content }} />
      {cardsHost
        ? createPortal(
          INSTRUCTORS.map((instructor) => <InstructorCard instructor={instructor} key={instructor.id} />),
          cardsHost
        )
        : null}
    </>
  );
}
