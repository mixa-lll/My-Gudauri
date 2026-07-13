import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ProfileGallery.scss';

export function ProfileGallery({ images, index, instructorName, isOpen, onClose, onIndexChange }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const showPrevious = () => onIndexChange((currentIndex) => (currentIndex - 1 + images.length) % images.length);
    const showNext = () => onIndexChange((currentIndex) => (currentIndex + 1) % images.length);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();

      if (event.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll('button:not([disabled])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('is-gallery-open');
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('is-gallery-open');
    };
  }, [images.length, isOpen, onClose, onIndexChange]);

  if (!isOpen) return null;

  const current = images[index];
  const showPrevious = () => onIndexChange((index - 1 + images.length) % images.length);
  const showNext = () => onIndexChange((index + 1) % images.length);

  return createPortal(
    <div className="profile-gallery" role="presentation">
      <button className="profile-gallery__backdrop" type="button" aria-label="Close gallery" onClick={onClose} />
      <section ref={panelRef} className="profile-gallery__panel" role="dialog" aria-modal="true" aria-labelledby="profile-gallery-title">
        <header className="profile-gallery__header">
          <div>
            <p>Instructor media</p>
            <h2 id="profile-gallery-title">{instructorName}</h2>
          </div>
          <p className="profile-gallery__counter" aria-live="polite">{index + 1} / {images.length}</p>
          <button ref={closeRef} className="profile-gallery__close" type="button" aria-label="Close gallery" onClick={onClose}>×</button>
        </header>

        <figure className="profile-gallery__stage">
          <img src={current.src} alt={current.alt} />
        </figure>

        <footer className="profile-gallery__footer">
          <button className="profile-gallery__nav" type="button" aria-label="Previous photo" onClick={showPrevious}>←</button>
          <div className="profile-gallery__thumbs" aria-label="Choose photo">
            {images.map((image, imageIndex) => (
              <button
                className={imageIndex === index ? 'is-active' : ''}
                type="button"
                aria-label={`Show photo ${imageIndex + 1}`}
                aria-current={imageIndex === index ? 'true' : undefined}
                onClick={() => onIndexChange(imageIndex)}
                key={image.src}
              >
                <img src={image.src} alt="" aria-hidden="true" />
              </button>
            ))}
          </div>
          <button className="profile-gallery__nav" type="button" aria-label="Next photo" onClick={showNext}>→</button>
        </footer>
      </section>
    </div>,
    document.body
  );
}
