import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'react-router-dom';
import legacyPageHtml from '../../../pages/design-3-profile.html?raw';
import { BackLink, Badge, Container, DestinationCard, ObjectHero, ProfileGallery, SiteFooter, SiteNavbar } from '../../design-system';
import { getInstructor, getInstructors } from '../../services/instructorsApi';
import { renderInstructorProfile } from '../../utils/renderInstructorProfile';
import './ProfileLegacy.scss';
import './ProfilePage.scss';

const LEGACY_SCRIPTS = [
  { id: 'profile-booking-draft', src: '/scripts/design-3-profile.js' }
];

function loadLegacyScript({ id, src }) {
  return new Promise((resolve, reject) => {
    document.querySelector(`script[data-legacy-script="${id}"]`)?.remove();

    const script = document.createElement('script');
    script.src = `${src}?v=${Date.now()}`;
    script.async = false;
    script.dataset.legacyScript = id;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.append(script);
  });
}

function extractBodyHtml(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const source = bodyMatch ? bodyMatch[1] : html;

  return source
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<footer class="home-footer">[\s\S]*?<\/footer>/i, '')
    .replace(/<header class="site-nav-host profile-nav-host" data-site-navbar><\/header>/i, '')
    .replaceAll('./design-2-instructors.html', '/instructors')
    .replaceAll('../index.html', '/')
    .replaceAll('../assets/', '/assets/')
    .replaceAll('../scripts/', '/scripts/');
}

const PROFILE_TEMPLATE = extractBodyHtml(legacyPageHtml);

export function ProfilePage() {
  const { slug } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [status, setStatus] = useState('loading');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [relatedInstructors, setRelatedInstructors] = useState([]);
  const [relatedMount, setRelatedMount] = useState(null);
  const profileRootRef = useRef(null);
  const galleryTriggerRef = useRef(null);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setGalleryIndex(0);
    setIsGalleryOpen(false);
    setRelatedInstructors([]);

    Promise.all([getInstructor(slug), getInstructors().catch(() => [])])
      .then(([data, instructors]) => {
        if (!active) return;
        setInstructor(data);
        setRelatedInstructors(instructors.filter((item) => item.slug !== slug).slice(0, 3));
        setStatus(data ? 'ready' : 'not-found');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const renderedProfile = useMemo(
    () => (instructor ? renderInstructorProfile(PROFILE_TEMPLATE, instructor) : null),
    [instructor]
  );

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
    requestAnimationFrame(() => galleryTriggerRef.current?.focus({ preventScroll: true }));
  }, []);

  useLayoutEffect(() => {
    setRelatedMount(profileRootRef.current?.querySelector('[data-profile-related-mount]') ?? null);
  }, [renderedProfile]);

  useEffect(() => {
    document.body.classList.add('profile-page-body');
    return () => document.body.classList.remove('profile-page-body');
  }, []);

  useEffect(() => {
    if (!renderedProfile) return undefined;

    document.title = `${instructor.name} — My Gudauri`;
    let active = true;

    const initLegacyScripts = async () => {
      for (const descriptor of LEGACY_SCRIPTS) {
        if (!active) return;
        await loadLegacyScript(descriptor);
      }
    };

    initLegacyScripts().catch(() => {
      // The profile remains readable if an optional legacy enhancement fails.
    });

    return () => {
      active = false;
      document.querySelectorAll('script[data-legacy-script]').forEach((script) => script.remove());
    };
  }, [instructor, renderedProfile]);

  useEffect(() => {
    if (!renderedProfile) return undefined;

    const triggers = Array.from(document.querySelectorAll('.legacy-profile-root [data-profile-gallery-open]'));
    const openGallery = (event) => {
      const trigger = event.currentTarget;
      galleryTriggerRef.current = trigger;
      setGalleryIndex(Number(trigger.dataset.galleryIndex) || 0);
      setIsGalleryOpen(true);
    };

    triggers.forEach((trigger) => trigger.addEventListener('click', openGallery));
    return () => triggers.forEach((trigger) => trigger.removeEventListener('click', openGallery));
  }, [renderedProfile]);

  if (status === 'loading') return <main className="profile-data-state">Loading instructor…</main>;

  if (status === 'not-found') {
    return <main className="profile-data-state"><h1>Instructor not found</h1><Link to="/instructors">Back to instructors</Link></main>;
  }

  if (status === 'error' || !renderedProfile) {
    return <main className="profile-data-state"><h1>Profile is temporarily unavailable</h1><p>Please try again later.</p></main>;
  }

  return (
    <>
      <SiteNavbar />
      <div className="profile-system-hero">
        <Container width="wide">
          <ObjectHero
            variant="split"
            breadcrumbs={<BackLink to="/instructors">Back to instructors</BackLink>}
            badges={[...instructor.sports.map((sport) => sport.name), instructor.role]}
            title={instructor.name}
            description={instructor.intro}
            media={(
              <div className="profile-object-media">
                <img src={instructor.heroImage} alt={instructor.heroImageAlt} loading="eager" />
                <Badge className="profile-object-media__availability" mediaOverlay>{instructor.availability || 'Schedule confirmed by manager'}</Badge>
                <button className="profile-object-media__gallery" type="button" data-profile-gallery-open data-gallery-index="0">
                  <span><strong>Open gallery</strong><small>{renderedProfile.media.length} photos</small></span>
                  <span aria-hidden="true">↗</span>
                </button>
              </div>
            )}
          />
        </Container>
      </div>
      <div ref={profileRootRef} className="legacy-profile-root" dangerouslySetInnerHTML={{ __html: renderedProfile.html }} />
      {relatedMount ? createPortal(
        relatedInstructors.length
          ? <div className="profile-related-grid">{relatedInstructors.map((item) => <DestinationCard key={item.slug} item={item} section="instructors" />)}</div>
          : <p className="profile-empty-state">More instructors will appear here soon.</p>,
        relatedMount
      ) : null}
      <SiteFooter />
      <ProfileGallery
        images={renderedProfile.media}
        index={galleryIndex}
        instructorName={instructor.name}
        isOpen={isGalleryOpen}
        onClose={closeGallery}
        onIndexChange={setGalleryIndex}
      />
    </>
  );
}
