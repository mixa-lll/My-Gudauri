import { Link } from 'react-router-dom';
import './InstructorCard.scss';

export function InstructorCard({ instructor, className = '' }) {
  return (
    <Link className={`instructor-card card-hoverable ${className}`.trim()} to={`/instructors/${instructor.slug}`}>
      <div className="instructor-media instructor-card__media" style={{ backgroundImage: `url(${instructor.image})` }}>
        <div className="chips-top instructor-card__langs">
          {instructor.languages.map((language) => (
            <span className="chip ui-pill-md ui-pill-md--outline" key={language.code} title={language.name}>
              {language.code}
            </span>
          ))}
        </div>

        <div className="chips-bottom instructor-card__sports">
          {instructor.sports.map((sport) => (
            <span className="chip ui-pill-md ui-pill-md--outline icon-chip" key={sport.slug}>
              <img src={sport.icon} alt="" aria-hidden="true" />
              {sport.name}
            </span>
          ))}
        </div>
      </div>

      <div className="instructor-body instructor-card__body">
        <h3>{instructor.name}</h3>
        <p>{instructor.description}</p>

        <div className="rating-line instructor-card__rating">
          <img src="/assets/design-2/stars-card.svg" alt={`${instructor.rating} stars`} />
          <span>{instructor.rating.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
          <img className="dot" src="/assets/design-2/dot-card.svg" alt="" aria-hidden="true" />
          <span className="rating-link">{instructor.reviews} reviews</span>
        </div>
      </div>
    </Link>
  );
}
