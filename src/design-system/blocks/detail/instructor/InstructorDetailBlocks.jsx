import { useId } from 'react';
import { SectionHeading, Surface } from '../../../../components';
import { BookingSteps } from '../../catalog/CatalogBlocks';
import './InstructorDetailBlocks.scss';

export const INSTRUCTOR_BOOKING_STEPS = Object.freeze([
  { title: 'Send your lesson request', description: 'Choose the date, duration, group size and your current level.' },
  { title: 'We confirm availability', description: 'A local manager checks the instructor schedule and final lesson details.' },
  { title: 'Receive the confirmation', description: 'Get the meeting point and a secure payment link after everything is agreed.' },
]);

export function InstructorBookingSteps() {
  return <BookingSteps context="object" kicker="Simple and clear" title="How booking works" items={INSTRUCTOR_BOOKING_STEPS} />;
}

export function InstructorCertifications({
  id = 'certifications',
  kicker = 'Professional qualifications',
  title = 'Certifications',
  description,
  items = [],
}) {
  const titleId = useId();
  if (!items.length) return null;

  return <section id={id} className="ds-instructor-certifications" aria-labelledby={titleId}>
    <SectionHeading kicker={kicker} title={title} titleId={titleId} description={description} size="sm" />
    <ul className="ds-instructor-certifications__grid">
      {items.map((item, index) => {
        const certificate = typeof item === 'string' ? { title: item } : item;
        const imageUrl = certificate.imageUrl ?? certificate.fileUrl;
        const fileUrl = certificate.fileUrl ?? certificate.imageUrl;
        const key = certificate.id ?? `${certificate.title}-${index}`;
        return <li key={key}>
          <Surface as="article" className="ds-instructor-certification" padding="none">
            {imageUrl ? <a className="ds-instructor-certification__media" href={fileUrl} target="_blank" rel="noreferrer" aria-label={`Open certificate: ${certificate.title}`}>
              <img src={imageUrl} alt={certificate.imageAlt ?? `${certificate.title} certificate`} loading="lazy" />
            </a> : null}
            <div className="ds-instructor-certification__content">
              <h3>{certificate.title}</h3>
              {certificate.description ?? certificate.level ? <p>{certificate.description ?? certificate.level}</p> : null}
              {fileUrl ? <a className="ds-instructor-certification__link" href={fileUrl} target="_blank" rel="noreferrer">View certificate <span aria-hidden="true">↗</span></a> : null}
            </div>
          </Surface>
        </li>;
      })}
    </ul>
  </section>;
}
