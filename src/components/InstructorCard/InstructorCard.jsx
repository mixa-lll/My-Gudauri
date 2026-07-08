import { Link } from 'react-router-dom';
import { Pill } from '../UI/Pill/Pill';
import './InstructorCard.scss';

export function InstructorCard({ instructor }) {
  return (
    <Link className="instructor-card" to="/profile">
      <div className="instructor-card__media" style={{ backgroundImage: `url(${instructor.image})` }}>
        <div className="instructor-card__langs">
          {instructor.languages.map((lang) => (
            <Pill key={lang} tone="dark" size="md">
              {lang}
            </Pill>
          ))}
        </div>

        <div className="instructor-card__sports">
          {instructor.sports.map((sport) => (
            <Pill key={sport} tone="light" size="md">
              {sport}
            </Pill>
          ))}
        </div>
      </div>

      <div className="instructor-card__body">
        <h3>{instructor.name}</h3>
        <p>{instructor.description}</p>

        <div className="instructor-card__rating">
          <img src="/assets/design-2/stars-card.svg" alt={`${instructor.rating} stars`} />
          <span>{instructor.rating}</span>
          <img src="/assets/design-2/dot-card.svg" alt="" aria-hidden="true" />
          <small>{instructor.reviews} reviews</small>
        </div>
      </div>
    </Link>
  );
}
