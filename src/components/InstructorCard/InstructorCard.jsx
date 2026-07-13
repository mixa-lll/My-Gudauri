import { Link } from 'react-router-dom';
import './InstructorCard.scss';

const SPORT_ICONS = {
  Ski: '/assets/design-2/icon-ski.png',
  Snowboard: '/assets/design-2/icon-snow.png'
};

export function InstructorCard({ instructor, className = '' }) {
  return (
    <Link className={`instructor-card card-hoverable ${className}`.trim()} to="/profile">
      <div className="instructor-media instructor-card__media" style={{ backgroundImage: `url(${instructor.image})` }}>
        <div className="chips-top instructor-card__langs">
          {instructor.languages.map((lang) => (
            <span className="chip ui-pill-md ui-pill-md--outline" key={lang}>
              {lang}
            </span>
          ))}
        </div>

        <div className="chips-bottom instructor-card__sports">
          {instructor.sports.map((sport) => (
            <span className="chip ui-pill-md ui-pill-md--outline icon-chip" key={sport}>
              <img src={SPORT_ICONS[sport]} alt="" aria-hidden="true" />
              {sport}
            </span>
          ))}
        </div>
      </div>

      <div className="instructor-body instructor-card__body">
        <h3>{instructor.name}</h3>
        <p>{instructor.description}</p>

        <div className="rating-line instructor-card__rating">
          <img src="/assets/design-2/stars-card.svg" alt={`${instructor.rating} stars`} />
          <span>{instructor.rating}</span>
          <img className="dot" src="/assets/design-2/dot-card.svg" alt="" aria-hidden="true" />
          <span className="rating-link">{instructor.reviews} reviews</span>
        </div>
      </div>
    </Link>
  );
}
