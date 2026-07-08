import { useEffect, useMemo } from 'react';
import legacyPageHtml from '../../../pages/design-3-profile.html?raw';
import '../../../styles/system.css';
import '../../../styles/shared-faq.css';
import '../../../styles/design-3-profile.css';
import './ProfilePage.scss';

const LEGACY_SCRIPTS = [
  { id: 'profile-shared-navbar', src: '/scripts/shared-navbar.js' },
  { id: 'profile-shared-faq', src: '/scripts/shared-faq.js' },
  { id: 'profile-booking-draft', src: '/scripts/design-3-profile.js' }
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

  return source
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replaceAll('./design-2-instructors.html', '/instructors')
    .replaceAll('../index.html', '/');
}

export function ProfilePage() {
  const content = useMemo(() => extractBodyHtml(legacyPageHtml), []);

  useEffect(() => {
    document.body.classList.add('profile-page-body');

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
      document.body.classList.remove('profile-page-body');
      document.querySelectorAll('script[data-legacy-script]').forEach((script) => script.remove());
    };
  }, []);

  return <div className="legacy-profile-root" dangerouslySetInnerHTML={{ __html: content }} />;
}
