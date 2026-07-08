import { useEffect, useRef } from 'react';
import '../../../styles/system.css';
import './SiteNavbar.scss';

const SCRIPT_ID = 'main-shared-navbar-script';
const SCRIPT_SRC = '/scripts/shared-navbar.js';

function loadNavbarScript() {
  return new Promise((resolve, reject) => {
    const prev = document.querySelector(`script[data-navbar-script="${SCRIPT_ID}"]`);
    if (prev) prev.remove();

    const script = document.createElement('script');
    script.src = `${SCRIPT_SRC}?v=${Date.now()}`;
    script.async = false;
    script.dataset.navbarScript = SCRIPT_ID;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${SCRIPT_SRC}`));
    document.body.append(script);
  });
}

export function SiteNavbar() {
  const hostRef = useRef(null);

  useEffect(() => {
    loadNavbarScript().catch(() => {
      // Keep page usable if script is temporarily unavailable.
    });

    return () => {
      const host = hostRef.current;
      if (host) host.innerHTML = '';

      const script = document.querySelector(`script[data-navbar-script="${SCRIPT_ID}"]`);
      if (script) script.remove();
    };
  }, []);

  return <header ref={hostRef} className="site-nav-host" data-site-navbar="" />;
}
